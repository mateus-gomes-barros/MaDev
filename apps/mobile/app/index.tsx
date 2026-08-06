import { appConfig } from "@madev/config";
import { brandColors } from "@madev/ui-tokens";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const journeySteps = [
  { label: "Conhecimento", value: "0%" },
  { label: "Prática", value: "0%" },
  { label: "Evidências", value: "0%" },
];

export default function HomeScreen() {
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
          <Text style={styles.brand}>{appConfig.name}</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MG</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SUA JORNADA DEV</Text>
          <Text style={styles.title}>Evolua com direção.</Text>
          <Text style={styles.description}>{appConfig.valueProposition}</Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardCaption}>JORNADA ATUAL</Text>
              <Text style={styles.cardTitle}>Full Stack Developer</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>INÍCIO</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressValue} />
          </View>
          <Text style={styles.progressLabel}>0% da jornada concluída</Text>

          <View style={styles.metrics}>
            {journeySteps.map((step) => (
              <View key={step.label} style={styles.metric}>
                <Text style={styles.metricValue}>{step.value}</Text>
                <Text style={styles.metricLabel}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Próximo passo</Text>
        <View style={styles.nextCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>01</Text>
          </View>
          <View style={styles.nextContent}>
            <Text style={styles.nextCaption}>FUNDAMENTOS DA WEB</Text>
            <Text style={styles.nextTitle}>Como a internet funciona</Text>
            <Text style={styles.nextDescription}>
              Entenda navegador, servidor, DNS e o caminho de uma requisição.
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
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
    backgroundColor: brandColors.surfaceElevated,
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
    backgroundColor: brandColors.surfaceElevated,
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
