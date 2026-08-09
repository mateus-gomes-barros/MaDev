import { appConfig } from "@madev/config";
import {
  getFullStackTrack,
  type TrackCatalog,
} from "@madev/data";
import { brandColors } from "@madev/ui-tokens";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "../lib/supabase";

const journeySteps = [
  { label: "Conhecimento", value: "0%" },
  { label: "Prática", value: "0%" },
  { label: "Evidências", value: "0%" },
];

function formatStepNumber(position: number) {
  return String(position).padStart(2, "0");
}

export default function HomeScreen() {
  const [track, setTrack] =
    useState<TrackCatalog | null>(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrack() {
      try {
        const fullStackTrack =
          await getFullStackTrack(supabase);

        if (!isMounted) {
          return;
        }

        setTrack(fullStackTrack);

        if (!fullStackTrack) {
          setLoadError(
            "A jornada Full Stack ainda não foi publicada.",
          );
        }
      } catch {
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
  }, []);

  const currentPhase = track?.phases[0];
  const nextSkill = currentPhase?.skills[0];

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

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MG</Text>
          </View>
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
                <View style={styles.progressValue} />
              </View>

              <Text style={styles.progressLabel}>
                0% da jornada concluída
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
    width: "3%",
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
  arrow: {
    color: brandColors.accent,
    fontSize: 30,
    marginLeft: 6,
  },
});
