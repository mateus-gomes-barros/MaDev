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

import { supabase } from "../../lib/supabase";

type SkillScreenData = {
  phase: TrackCatalogPhase;
  skill: TrackCatalogSkill;
};

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

        if (isMounted) {
          setData(result);
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
  }, [skillSlug]);

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

            <Pressable
              onPress={() => {
                Alert.alert(
                  "Próxima etapa",
                  "Agora vamos conectar o início do aprendizado ao progresso salvo no Supabase.",
                );
              }}
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={styles.startButtonText}
              >
                Iniciar aprendizado
              </Text>
            </Pressable>
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
    borderRadius: 17,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 17,
  },
  startButtonText: {
    color: brandColors.background,
    fontSize: 14,
    fontWeight: "900",
  },
});
