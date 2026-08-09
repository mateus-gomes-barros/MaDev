import { appConfig } from "@madev/config";
import {
  getFullStackTrack,
  type TrackCatalog,
} from "@madev/data";
import { brandColors } from "@madev/ui-tokens";
import {
  router,
  useFocusEffect,
} from "expo-router";
import {
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  type DimensionValue,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

type MasteryStatus =
  | "not_started"
  | "studying"
  | "understands_concept"
  | "practiced"
  | "used_in_project"
  | "independent"
  | "can_teach";

type SkillProgress = {
  skill_id: string;
  mastery_status: MasteryStatus;
  knowledge_score: number;
  practice_score: number;
  evidence_score: number;
};

type ScoreKey =
  | "knowledge_score"
  | "practice_score"
  | "evidence_score";

const masteryLabels: Record<
  MasteryStatus,
  string
> = {
  not_started: "Ainda não comecei",
  studying: "Estou estudando",
  understands_concept: "Entendo o conceito",
  practiced: "Já pratiquei",
  used_in_project: "Usei em projeto",
  independent: "Faço sem ajuda",
  can_teach: "Consigo ensinar",
};

const completedMasteryStatuses =
  new Set<MasteryStatus>([
    "independent",
    "can_teach",
  ]);

function formatStepNumber(position: number) {
  return String(position).padStart(2, "0");
}

export default function HomeScreen() {
  const { session, signOut } = useAuth();
  const [track, setTrack] =
    useState<TrackCatalog | null>(null);
  const [skillProgress, setSkillProgress] =
    useState<SkillProgress[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  async function handleSignOut() {
    const result = await signOut();

    if (result.error) {
      Alert.alert(
        "Não foi possível sair",
        result.error,
      );
    }
  }

  function confirmSignOut() {
    Alert.alert(
      "Sair da conta",
      "Deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            void handleSignOut();
          },
        },
      ],
    );
  }

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadTrack() {
        setIsLoading(true);
        setLoadError(null);

        try {
          const fullStackTrack =
            await getFullStackTrack(supabase);

          if (!fullStackTrack) {
            if (isMounted) {
              setTrack(null);
              setSkillProgress([]);
              setLoadError(
                "A jornada Full Stack ainda não foi publicada.",
              );
            }

            return;
          }

          const userId = session?.user.id;

          if (!userId) {
            throw new Error(
              "Sessão não encontrada.",
            );
          }

          const skillIds =
            fullStackTrack.phases.flatMap(
              (phase) =>
                phase.skills.map(
                  (skill) => skill.id,
                ),
            );

          let progress: SkillProgress[] = [];

          if (skillIds.length > 0) {
            const {
              data: progressData,
              error: progressError,
            } = await supabase
              .from("user_skills")
              .select(
                "skill_id, mastery_status, knowledge_score, practice_score, evidence_score",
              )
              .eq("user_id", userId)
              .in("skill_id", skillIds);

            if (progressError) {
              throw progressError;
            }

            progress = progressData ?? [];
          }

          if (isMounted) {
            setTrack(fullStackTrack);
            setSkillProgress(progress);
          }
        } catch (error) {
          console.error(
            "Erro ao carregar jornada:",
            error,
          );

          if (isMounted) {
            setLoadError(
              "Não foi possível carregar a jornada. Verifique sua conexão e tente novamente.",
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }

      void loadTrack();

      return () => {
        isMounted = false;
      };
    }, [session?.user.id]),
  );

  const currentPhase = track?.phases[0];

  const masteryBySkillId = new Map(
    skillProgress.map((progress) => [
      progress.skill_id,
      progress.mastery_status,
    ]),
  );

  const currentPhaseSkillIds = new Set(
    currentPhase?.skills.map(
      (skill) => skill.id,
    ) ?? [],
  );

  const currentPhaseProgress =
    skillProgress.filter((progress) =>
      currentPhaseSkillIds.has(
        progress.skill_id,
      ),
    );

  const totalSkillCount =
    currentPhase?.skills.length ?? 0;

  const completedSkillCount =
    currentPhaseProgress.filter((progress) =>
      completedMasteryStatuses.has(
        progress.mastery_status,
      ),
    ).length;

  const phaseProgress =
    totalSkillCount > 0
      ? Math.round(
          (completedSkillCount /
            totalSkillCount) *
            100,
        )
      : 0;

  const phaseProgressWidth =
    (phaseProgress + "%") as DimensionValue;

  function averageScore(key: ScoreKey) {
    if (totalSkillCount === 0) {
      return 0;
    }

    const total =
      currentPhaseProgress.reduce(
        (sum, progress) =>
          sum + progress[key],
        0,
      );

    return Math.round(total / totalSkillCount);
  }

  const journeySteps = [
    {
      label: "Conhecimento",
      value:
        String(
          averageScore("knowledge_score"),
        ) + "%",
    },
    {
      label: "Prática",
      value:
        String(
          averageScore("practice_score"),
        ) + "%",
    },
    {
      label: "Evidências",
      value:
        String(
          averageScore("evidence_score"),
        ) + "%",
    },
  ];

  const nextSkill =
    currentPhase?.skills.find(
      (skill) =>
        (masteryBySkillId.get(skill.id) ??
          "not_started") === "not_started",
    ) ??
    currentPhase?.skills.find((skill) => {
      const masteryStatus =
        masteryBySkillId.get(skill.id) ??
        "not_started";

      return !completedMasteryStatuses.has(
        masteryStatus,
      );
    }) ??
    currentPhase?.skills[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

          <Text style={styles.brand}>
            {appConfig.name}
          </Text>

          <Pressable
            accessibilityLabel="Sair da conta"
            accessibilityRole="button"
            onPress={confirmSignOut}
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.avatarPressed,
            ]}
          >
            <Text style={styles.avatarText}>MG</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            SUA JORNADA DEV
          </Text>
          <Text style={styles.title}>
            Evolua com direção.
          </Text>
          <Text style={styles.description}>
            {appConfig.valueProposition}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator
              color={brandColors.accent}
              size="large"
            />
            <Text style={styles.stateTitle}>
              Carregando sua jornada
            </Text>
            <Text style={styles.stateDescription}>
              Buscando as fases e habilidades da
              jornada Full Stack.
            </Text>
          </View>
        ) : loadError ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateSymbol}>!</Text>
            <Text style={styles.stateTitle}>
              Jornada indisponível
            </Text>
            <Text style={styles.stateDescription}>
              {loadError}
            </Text>
          </View>
        ) : track ? (
          <>
            <View style={styles.progressCard}>
              <View style={styles.cardHeader}>
                <View
                  style={styles.cardHeaderContent}
                >
                  <Text style={styles.cardCaption}>
                    JORNADA ATUAL
                  </Text>
                  <Text style={styles.cardTitle}>
                    {track.name}
                  </Text>
                </View>

                <View style={styles.levelBadge}>
                  <Text
                    style={styles.levelBadgeText}
                  >
                    {currentPhase
                      ? `FASE ${currentPhase.position}`
                      : "INÍCIO"}
                  </Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressValue,
                    {
                      width: phaseProgressWidth,
                    },
                  ]}
                />
              </View>

              <Text style={styles.progressLabel}>
                {phaseProgress}% da fase concluída
                {" · "}
                {completedSkillCount} de{" "}
                {totalSkillCount} habilidades
              </Text>

              <View style={styles.metrics}>
                {journeySteps.map((step) => (
                  <View
                    key={step.label}
                    style={styles.metric}
                  >
                    <Text
                      style={styles.metricValue}
                    >
                      {step.value}
                    </Text>
                    <Text
                      style={styles.metricLabel}
                    >
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              Próximo passo
            </Text>

            <Pressable
              disabled={!nextSkill}
              onPress={() => {
                if (!nextSkill) {
                  return;
                }

                router.push({
                  pathname: "/skills/[skillSlug]",
                  params: {
                    skillSlug: nextSkill.slug,
                  },
                });
              }}
              style={styles.nextCard}
            >
              <View style={styles.stepNumber}>
                <Text
                  style={styles.stepNumberText}
                >
                  {nextSkill
                    ? formatStepNumber(
                        nextSkill.position,
                      )
                    : "01"}
                </Text>
              </View>

              <View style={styles.nextContent}>
                <Text style={styles.nextCaption}>
                  {currentPhase?.name.toUpperCase() ??
                    "JORNADA FULL STACK"}
                </Text>

                <Text style={styles.nextTitle}>
                  {nextSkill?.name ??
                    "Jornada em preparação"}
                </Text>

                <Text
                  style={styles.nextDescription}
                >
                  {nextSkill?.description ??
                    "O próximo conteúdo será exibido assim que estiver publicado."}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>
              Habilidades da fase
            </Text>

            <View style={styles.skillsList}>
              {currentPhase?.skills.map(
                (skill) => {
                  const masteryStatus =
                    masteryBySkillId.get(
                      skill.id,
                    ) ?? "not_started";

                  const hasStarted =
                    masteryStatus !==
                    "not_started";

                  return (
                    <Pressable
                      accessibilityLabel={
                        skill.name
                      }
                      accessibilityRole="button"
                      key={skill.id}
                      onPress={() => {
                        router.push({
                          pathname:
                            "/skills/[skillSlug]",
                          params: {
                            skillSlug:
                              skill.slug,
                          },
                        });
                      }}
                      style={({ pressed }) => [
                        styles.skillCard,
                        pressed &&
                          styles.avatarPressed,
                      ]}
                    >
                      <View
                        style={styles.skillNumber}
                      >
                        <Text
                          style={
                            styles.skillNumberText
                          }
                        >
                          {formatStepNumber(
                            skill.position,
                          )}
                        </Text>
                      </View>

                      <View
                        style={styles.skillContent}
                      >
                        <Text
                          style={styles.skillTitle}
                        >
                          {skill.name}
                        </Text>

                        <View
                          style={[
                            styles.skillStatus,
                            hasStarted &&
                              styles.skillStatusActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.skillStatusText,
                              hasStarted &&
                                styles.skillStatusTextActive,
                            ]}
                          >
                            {
                              masteryLabels[
                                masteryStatus
                              ]
                            }
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={styles.skillArrow}
                      >
                        ›
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: brandColors.background,
  },
  container: {
    paddingHorizontal: 22,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 18,
  },
  logo: {
    alignItems: "center",
    backgroundColor: brandColors.accent,
    borderRadius: 10,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  logoText: {
    color: brandColors.background,
    fontSize: 19,
    fontWeight: "900",
  },
  brand: {
    color: brandColors.text,
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 10,
  },
  avatar: {
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
  avatarPressed: {
    opacity: 0.7,
  },
  avatarText: {
    color: brandColors.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },
  hero: {
    paddingBottom: 28,
    paddingTop: 36,
  },
  eyebrow: {
    color: brandColors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  title: {
    color: brandColors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1.4,
    lineHeight: 44,
    marginTop: 10,
  },
  description: {
    color: brandColors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 340,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 42,
  },
  stateSymbol: {
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
  progressCard: {
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHeaderContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardCaption: {
    color: brandColors.textSubtle,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  cardTitle: {
    color: brandColors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 5,
  },
  levelBadge: {
    backgroundColor: brandColors.accentSoft,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  levelBadgeText: {
    color: brandColors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  progressTrack: {
    backgroundColor:
      brandColors.surfaceElevated,
    borderRadius: 99,
    height: 8,
    marginTop: 24,
    overflow: "hidden",
  },
  progressValue: {
    backgroundColor: brandColors.accent,
    borderRadius: 99,
    height: "100%",
  },
  progressLabel: {
    color: brandColors.textSubtle,
    fontSize: 12,
    marginTop: 8,
  },
  metrics: {
    borderTopColor: brandColors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 18,
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    color: brandColors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  metricLabel: {
    color: brandColors.textSubtle,
    fontSize: 11,
    marginTop: 3,
  },
  sectionTitle: {
    color: brandColors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 30,
  },
  nextCard: {
    alignItems: "center",
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    padding: 16,
  },
  stepNumber: {
    alignItems: "center",
    backgroundColor: brandColors.accentSoft,
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  stepNumberText: {
    color: brandColors.accent,
    fontSize: 15,
    fontWeight: "900",
  },
  nextContent: {
    flex: 1,
    marginLeft: 14,
  },
  nextCaption: {
    color: brandColors.textSubtle,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  nextTitle: {
    color: brandColors.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },
  nextDescription: {
    color: brandColors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  skillsList: {
    gap: 10,
  },
  skillCard: {
    alignItems: "center",
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14,
  },
  skillNumber: {
    alignItems: "center",
    backgroundColor:
      brandColors.surfaceElevated,
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  skillNumberText: {
    color: brandColors.textSubtle,
    fontSize: 13,
    fontWeight: "900",
  },
  skillContent: {
    alignItems: "flex-start",
    flex: 1,
    marginLeft: 13,
  },
  skillTitle: {
    color: brandColors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  skillStatus: {
    backgroundColor:
      brandColors.surfaceElevated,
    borderRadius: 99,
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  skillStatusActive: {
    backgroundColor: brandColors.accentSoft,
  },
  skillStatusText: {
    color: brandColors.textSubtle,
    fontSize: 10,
    fontWeight: "800",
  },
  skillStatusTextActive: {
    color: brandColors.accent,
  },
  skillArrow: {
    color: brandColors.textSubtle,
    fontSize: 25,
    marginLeft: 8,
  },
  arrow: {
    color: brandColors.accent,
    fontSize: 30,
    marginLeft: 6,
  },
});
