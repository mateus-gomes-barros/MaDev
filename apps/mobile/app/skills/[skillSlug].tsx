import {
  getFullStackTrack,
  type TrackCatalogPhase,
  type TrackCatalogSkill,
} from "@madev/data";
import { brandColors } from "@madev/ui-tokens";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type SkillScreenData = {
  phase: TrackCatalogPhase;
  skill: TrackCatalogSkill;
};

const masteryOptions = [
  {
    value: "not_started",
    title: "Ainda não comecei",
    description:
      "Esta habilidade ainda está na sua lista.",
  },
  {
    value: "studying",
    title: "Estou estudando",
    description:
      "Você está aprendendo os fundamentos.",
  },
  {
    value: "understands_concept",
    title: "Entendo o conceito",
    description:
      "Você compreende como a habilidade funciona.",
  },
  {
    value: "practiced",
    title: "Já pratiquei",
    description:
      "Você realizou exercícios ou pequenos testes.",
  },
  {
    value: "used_in_project",
    title: "Usei em projeto",
    description:
      "Você aplicou a habilidade em um projeto.",
  },
  {
    value: "independent",
    title: "Faço sem ajuda",
    description:
      "Você consegue usar a habilidade sozinho.",
  },
  {
    value: "can_teach",
    title: "Consigo ensinar",
    description:
      "Você domina e consegue orientar outras pessoas.",
  },
] as const;

type SkillMasteryState =
  (typeof masteryOptions)[number]["value"];

function formatEstimatedHours(
  hours: number | null,
) {
  if (!hours) {
    return "Tempo em definição";
  }

  return hours === 1
    ? "1 hora estimada"
    : `${hours} horas estimadas`;
}

function formatNumber(position: number) {
  return String(position).padStart(2, "0");
}

export default function SkillScreen() {
  const { session } = useAuth();

  const params = useLocalSearchParams<{
    skillSlug?: string | string[];
  }>();

  const skillSlug = Array.isArray(
    params.skillSlug,
  )
    ? params.skillSlug[0]
    : params.skillSlug;

  const [data, setData] =
    useState<SkillScreenData | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);
  const [masteryStatus, setMasteryStatus] =
    useState<SkillMasteryState>(
      "not_started",
    );
  const [
    savedMasteryStatus,
    setSavedMasteryStatus,
  ] = useState<SkillMasteryState>(
    "not_started",
  );
  const [startedAt, setStartedAt] =
    useState<string | null>(null);
  const [completedAt, setCompletedAt] =
    useState<string | null>(null);
  const [
    hasSavedProgress,
    setHasSavedProgress,
  ] = useState(false);
  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSkill() {
      try {
        if (!skillSlug) {
          throw new Error(
            "Identificador não informado.",
          );
        }

        const track =
          await getFullStackTrack(supabase);

        if (!track) {
          throw new Error(
            "Jornada não encontrada.",
          );
        }

        let result: SkillScreenData | null =
          null;

        for (const phase of track.phases) {
          const skill = phase.skills.find(
            (item) =>
              item.slug === skillSlug,
          );

          if (skill) {
            result = {
              phase,
              skill,
            };

            break;
          }
        }

        if (!result) {
          throw new Error(
            "Habilidade não encontrada.",
          );
        }

        const userId = session?.user.id;

        if (!userId) {
          throw new Error(
            "Sessão não encontrada.",
          );
        }

        const {
          data: progress,
          error: progressError,
        } = await supabase
          .from("user_skills")
          .select(
            "mastery_status, started_at, completed_at",
          )
          .eq("user_id", userId)
          .eq("skill_id", result.skill.id)
          .maybeSingle();

        if (progressError) {
          throw progressError;
        }

        if (isMounted) {
          const currentStatus =
            progress?.mastery_status ??
            "not_started";

          setData(result);
          setMasteryStatus(currentStatus);
          setSavedMasteryStatus(
            currentStatus,
          );
          setStartedAt(
            progress?.started_at ?? null,
          );
          setCompletedAt(
            progress?.completed_at ?? null,
          );
          setHasSavedProgress(
            Boolean(progress),
          );
        }
      } catch (error) {
        console.error(
          "Erro ao carregar habilidade:",
          error,
        );

        if (isMounted) {
          setLoadError(
            "Não foi possível carregar esta habilidade.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSkill();

    return () => {
      isMounted = false;
    };
  }, [session?.user.id, skillSlug]);

  async function saveMasteryStatus() {
    const userId = session?.user.id;

    if (!userId || !data) {
      Alert.alert(
        "Não foi possível salvar",
        "Entre novamente na sua conta e tente outra vez.",
      );

      return;
    }

    const now = new Date().toISOString();
    const isStarted =
      masteryStatus !== "not_started";
    const isCompleted =
      masteryStatus === "independent" ||
      masteryStatus === "can_teach";

    const nextStartedAt = isStarted
      ? startedAt ?? now
      : null;

    const nextCompletedAt = isCompleted
      ? completedAt ?? now
      : null;

    setIsSaving(true);

    const { error } = await supabase
      .from("user_skills")
      .upsert(
        {
          user_id: userId,
          skill_id: data.skill.id,
          mastery_status: masteryStatus,
          started_at: nextStartedAt,
          completed_at: nextCompletedAt,
        },
        {
          onConflict: "user_id,skill_id",
        },
      );

    setIsSaving(false);

    if (error) {
      console.error(
        "Erro ao salvar progresso:",
        error,
      );

      Alert.alert(
        "Não foi possível salvar",
        "Seu progresso não foi alterado. Tente novamente.",
      );

      return;
    }

    setStartedAt(nextStartedAt);
    setCompletedAt(nextCompletedAt);
    setSavedMasteryStatus(masteryStatus);
    setHasSavedProgress(true);
  }

  const checklistItemCount =
    data?.skill.checklists.reduce(
      (total, checklist) =>
        total + checklist.items.length,
      0,
    ) ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar"
            hitSlop={12}
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backIcon}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Habilidade
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator
              color={brandColors.accent}
              size="large"
            />

            <Text style={styles.stateTitle}>
              Carregando habilidade
            </Text>

            <Text style={styles.stateDescription}>
              Buscando o conteúdo e o checklist
              oficial.
            </Text>
          </View>
        ) : loadError ? (
          <View style={styles.stateCard}>
            <Text style={styles.errorSymbol}>
              !
            </Text>

            <Text style={styles.stateTitle}>
              Habilidade indisponível
            </Text>

            <Text style={styles.stateDescription}>
              {loadError}
            </Text>
          </View>
        ) : data ? (
          <>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>
                FASE {data.phase.position} ·{" "}
                {data.phase.name.toUpperCase()}
              </Text>

              <Text style={styles.title}>
                {data.skill.name}
              </Text>

              <Text style={styles.description}>
                {data.skill.description ??
                  "Aprenda e pratique esta habilidade para avançar na jornada."}
              </Text>

              <View style={styles.tags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {data.skill.category ??
                      "Fundamentos"}
                  </Text>
                </View>

                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {formatEstimatedHours(
                      data.skill.estimatedHours,
                    )}
                  </Text>
                </View>

                {data.skill.isRequired ? (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      Obrigatória
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.masteryCard}>
          <Text style={styles.sectionEyebrow}>
            SEU PROGRESSO
          </Text>

          <Text style={styles.masteryTitle}>
            Qual é o seu nível?
          </Text>

          <Text style={styles.masteryDescription}>
            Selecione o estado que melhor
            representa seu domínio atual.
          </Text>

          <View style={styles.masteryOptions}>
            {masteryOptions.map((option) => {
              const isSelected =
                masteryStatus === option.value;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                  disabled={isSaving}
                  key={option.value}
                  onPress={() =>
                    setMasteryStatus(
                      option.value,
                    )
                  }
                  style={({ pressed }) => [
                    styles.masteryOption,
                    isSelected &&
                      styles.masteryOptionSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.masteryIndicator,
                      isSelected &&
                        styles.masteryIndicatorSelected,
                    ]}
                  >
                    {isSelected ? (
                      <View
                        style={
                          styles.masteryIndicatorDot
                        }
                      />
                    ) : null}
                  </View>

                  <View
                    style={
                      styles.masteryOptionContent
                    }
                  >
                    <Text
                      style={
                        styles.masteryOptionTitle
                      }
                    >
                      {option.title}
                    </Text>

                    <Text
                      style={
                        styles.masteryOptionDescription
                      }
                    >
                      {option.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={
              isSaving ||
              masteryStatus === savedMasteryStatus
            }
            onPress={() => {
              void saveMasteryStatus();
            }}
            style={({ pressed }) => [
              styles.startButton,
              (isSaving ||
                masteryStatus ===
                  savedMasteryStatus) &&
                styles.saveButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator
                color={brandColors.background}
                size="small"
              />
            ) : null}

            <Text style={styles.startButtonText}>
              {isSaving
                ? "Salvando..."
                : "Salvar progresso"}
            </Text>
          </Pressable>

          {hasSavedProgress &&
          masteryStatus ===
            savedMasteryStatus ? (
            <Text style={styles.savedText}>
              Progresso salvo
            </Text>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={styles.sectionEyebrow}
                >
                  CONTEÚDO OFICIAL
                </Text>

                <Text style={styles.sectionTitle}>
                  Checklist
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text
                  style={styles.countBadgeText}
                >
                  {checklistItemCount}
                </Text>
              </View>
            </View>

            {data.skill.checklists.length >
            0 ? (
              data.skill.checklists.map(
                (checklist) => (
                  <View
                    key={checklist.id}
                    style={styles.checklistCard}
                  >
                    <Text
                      style={
                        styles.checklistTitle
                      }
                    >
                      {checklist.title}
                    </Text>

                    {checklist.description ? (
                      <Text
                        style={
                          styles.checklistDescription
                        }
                      >
                        {checklist.description}
                      </Text>
                    ) : null}

                    <View style={styles.items}>
                      {checklist.items.map(
                        (item) => (
                          <View
                            key={item.id}
                            style={styles.item}
                          >
                            <View
                              style={
                                styles.itemNumber
                              }
                            >
                              <Text
                                style={
                                  styles.itemNumberText
                                }
                              >
                                {formatNumber(
                                  item.position,
                                )}
                              </Text>
                            </View>

                            <View
                              style={
                                styles.itemContent
                              }
                            >
                              <Text
                                style={
                                  styles.itemTitle
                                }
                              >
                                {item.title}
                              </Text>

                              {item.description ? (
                                <Text
                                  style={
                                    styles.itemDescription
                                  }
                                >
                                  {item.description}
                                </Text>
                              ) : null}

                              {item.estimatedMinutes ? (
                                <Text
                                  style={
                                    styles.itemDuration
                                  }
                                >
                                  {
                                    item.estimatedMinutes
                                  }{" "}
                                  min
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                ),
              )
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  Checklist em preparação
                </Text>

                <Text
                  style={styles.emptyDescription}
                >
                  Os conteúdos desta habilidade
                  serão publicados em breve.
                </Text>
              </View>
            )}


          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: brandColors.background,
    flex: 1,
  },
  container: {
    paddingBottom: 48,
    paddingHorizontal: 22,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 18,
  },
  backButton: {
    alignItems: "center",
    backgroundColor:
      brandColors.surfaceElevated,
    borderColor: brandColors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  backIcon: {
    color: brandColors.text,
    fontSize: 29,
    lineHeight: 31,
    marginTop: -2,
  },
  headerTitle: {
    color: brandColors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  headerSpacer: {
    width: 36,
  },
  pressed: {
    opacity: 0.78,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  errorSymbol: {
    color: brandColors.accent,
    fontSize: 32,
    fontWeight: "900",
  },
  stateTitle: {
    color: brandColors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  stateDescription: {
    color: brandColors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: "center",
  },
  hero: {
    paddingBottom: 12,
    paddingTop: 28,
  },
  eyebrow: {
    color: brandColors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  title: {
    color: brandColors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.2,
    lineHeight: 39,
    marginTop: 12,
  },
  description: {
    color: brandColors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  tag: {
    backgroundColor:
      brandColors.surfaceElevated,
    borderColor: brandColors.border,
    borderRadius: 99,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  tagText: {
    color: brandColors.accent,
    fontSize: 10,
    fontWeight: "800",
  },
  masteryCard: {
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 24,
    padding: 18,
  },
  masteryTitle: {
    color: brandColors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 5,
  },
  masteryDescription: {
    color: brandColors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  masteryOptions: {
    gap: 10,
    marginTop: 18,
  },
  masteryOption: {
    alignItems: "center",
    backgroundColor:
      brandColors.surfaceElevated,
    borderColor: brandColors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14,
  },
  masteryOptionSelected: {
    borderColor: brandColors.accent,
  },
  masteryIndicator: {
    alignItems: "center",
    borderColor: brandColors.textMuted,
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  masteryIndicatorSelected: {
    borderColor: brandColors.accent,
  },
  masteryIndicatorDot: {
    backgroundColor: brandColors.accent,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  masteryOptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  masteryOptionTitle: {
    color: brandColors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  masteryOptionDescription: {
    color: brandColors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  savedText: {
    color: brandColors.accent,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 30,
  },
  sectionEyebrow: {
    color: brandColors.textMuted,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  sectionTitle: {
    color: brandColors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  countBadge: {
    alignItems: "center",
    backgroundColor:
      brandColors.surfaceElevated,
    borderColor: brandColors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    minWidth: 32,
    paddingHorizontal: 10,
  },
  countBadgeText: {
    color: brandColors.accent,
    fontSize: 12,
    fontWeight: "900",
  },
  checklistCard: {
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
  },
  checklistTitle: {
    color: brandColors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  checklistDescription: {
    color: brandColors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  items: {
    gap: 12,
    marginTop: 18,
  },
  item: {
    alignItems: "flex-start",
    backgroundColor:
      brandColors.surfaceElevated,
    borderRadius: 16,
    flexDirection: "row",
    padding: 14,
  },
  itemNumber: {
    alignItems: "center",
    backgroundColor:
      brandColors.background,
    borderColor: brandColors.border,
    borderRadius: 11,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  itemNumberText: {
    color: brandColors.accent,
    fontSize: 11,
    fontWeight: "900",
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: brandColors.text,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19,
  },
  itemDescription: {
    color: brandColors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  itemDuration: {
    color: brandColors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
  },
  emptyTitle: {
    color: brandColors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  emptyDescription: {
    color: brandColors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  startButton: {
    alignItems: "center",
    backgroundColor: brandColors.accent,
    flexDirection: "row",
    gap: 8,
    borderRadius: 17,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 17,
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  startButtonText: {
    color: brandColors.background,
    fontSize: 14,
    fontWeight: "900",
  },
});
