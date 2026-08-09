import { appConfig } from "@madev/config";
import {
  loginCredentialsSchema,
  signUpCredentialsSchema,
} from "@madev/validation";
import { brandColors } from "@madev/ui-tokens";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";

type AuthMode = "login" | "signup";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] =
    useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");
  const [feedback, setFeedback] =
    useState<{
      type: "error" | "success";
      message: string;
    } | null>(null);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword("");
    setPasswordConfirmation("");
    setFeedback(null);
  }

  async function handleSubmit() {
    setFeedback(null);

    const result =
      mode === "login"
        ? loginCredentialsSchema.safeParse({
            email,
            password,
          })
        : signUpCredentialsSchema.safeParse({
            email,
            password,
            passwordConfirmation,
          });

    if (!result.success) {
      setFeedback({
        type: "error",
        message:
          result.error.issues[0]?.message ??
          "Verifique os dados informados.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const authResult = await signIn(
          result.data.email,
          result.data.password,
        );

        if (authResult.error) {
          setFeedback({
            type: "error",
            message: authResult.error,
          });
        }

        return;
      }

      const authResult = await signUp(
        result.data.email,
        result.data.password,
      );

      if (authResult.error) {
        setFeedback({
          type: "error",
          message: authResult.error,
        });

        return;
      }

      if (
        authResult.needsEmailConfirmation
      ) {
        setMode("login");
        setPassword("");
        setPasswordConfirmation("");
        setFeedback({
          type: "success",
          message:
            "Cadastro realizado. Verifique seu e-mail para confirmar a conta.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                M
              </Text>
            </View>

            <Text style={styles.brandName}>
              {appConfig.name}
            </Text>
          </View>

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>
              SUA EVOLUÇÃO COMEÇA AQUI
            </Text>

            <Text style={styles.title}>
              Construa sua carreira com{" "}
              <Text style={styles.titleAccent}>
                direção.
              </Text>
            </Text>

            <Text style={styles.description}>
              Organize o que aprender, pratique
              com propósito e comprove sua
              evolução como desenvolvedor.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabs}>
              <Pressable
                onPress={() =>
                  changeMode("login")
                }
                style={[
                  styles.tab,
                  mode === "login" &&
                    styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "login" &&
                      styles.activeTabText,
                  ]}
                >
                  Entrar
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  changeMode("signup")
                }
                style={[
                  styles.tab,
                  mode === "signup" &&
                    styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "signup" &&
                      styles.activeTabText,
                  ]}
                >
                  Criar conta
                </Text>
              </Pressable>
            </View>

            <Text style={styles.formTitle}>
              {mode === "login"
                ? "Acesse sua jornada"
                : "Comece gratuitamente"}
            </Text>

            <Text style={styles.formDescription}>
              {mode === "login"
                ? "Continue de onde você parou."
                : "Crie sua conta para iniciar sua evolução."}
            </Text>

            {feedback ? (
              <View
                style={[
                  styles.feedback,
                  feedback.type === "error"
                    ? styles.errorFeedback
                    : styles.successFeedback,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    feedback.type === "error"
                      ? styles.errorText
                      : styles.successText,
                  ]}
                >
                  {feedback.message}
                </Text>
              </View>
            ) : null}

            <Text style={styles.label}>
              E-mail
            </Text>

            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              editable={!isSubmitting}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="voce@exemplo.com"
              placeholderTextColor={
                brandColors.textMuted
              }
              style={styles.input}
              value={email}
            />

            <Text style={styles.label}>
              Senha
            </Text>

            <TextInput
              autoCapitalize="none"
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
              editable={!isSubmitting}
              onChangeText={setPassword}
              placeholder={
                mode === "login"
                  ? "Digite sua senha"
                  : "Mínimo de 8 caracteres"
              }
              placeholderTextColor={
                brandColors.textMuted
              }
              secureTextEntry
              style={styles.input}
              value={password}
            />

            {mode === "signup" ? (
              <>
                <Text style={styles.label}>
                  Confirmar senha
                </Text>

                <TextInput
                  autoCapitalize="none"
                  autoComplete="new-password"
                  editable={!isSubmitting}
                  onChangeText={
                    setPasswordConfirmation
                  }
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={
                    brandColors.textMuted
                  }
                  secureTextEntry
                  style={styles.input}
                  value={passwordConfirmation}
                />
              </>
            ) : null}

            <Pressable
              disabled={isSubmitting}
              onPress={() => {
                void handleSubmit();
              }}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.pressed,
                isSubmitting &&
                  styles.disabledButton,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  color={brandColors.background}
                  size="small"
                />
              ) : (
                <Text
                  style={styles.submitButtonText}
                >
                  {mode === "login"
                    ? "Entrar na minha conta"
                    : "Criar minha conta"}
                </Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.footnote}>
            Conhecimento. Prática. Evidências.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: brandColors.background,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    alignItems: "center",
    backgroundColor: brandColors.accent,
    borderRadius: 12,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  logoText: {
    color: brandColors.background,
    fontSize: 18,
    fontWeight: "900",
  },
  brandName: {
    color: brandColors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  intro: {
    marginTop: 38,
  },
  eyebrow: {
    color: brandColors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  title: {
    color: brandColors.text,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1.3,
    lineHeight: 41,
    marginTop: 12,
  },
  titleAccent: {
    color: brandColors.accent,
  },
  description: {
    color: brandColors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
  },
  card: {
    backgroundColor: brandColors.surface,
    borderColor: brandColors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 30,
    padding: 18,
  },
  tabs: {
    backgroundColor:
      brandColors.surfaceElevated,
    borderRadius: 14,
    flexDirection: "row",
    padding: 4,
  },
  tab: {
    alignItems: "center",
    borderRadius: 11,
    flex: 1,
    paddingVertical: 11,
  },
  activeTab: {
    backgroundColor: brandColors.accent,
  },
  tabText: {
    color: brandColors.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },
  activeTabText: {
    color: brandColors.background,
  },
  formTitle: {
    color: brandColors.text,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 24,
  },
  formDescription: {
    color: brandColors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
    marginTop: 5,
  },
  feedback: {
    borderRadius: 13,
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  errorFeedback: {
    backgroundColor: "#3A171D",
  },
  successFeedback: {
    backgroundColor: "#153227",
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  errorText: {
    color: "#FF9CA9",
  },
  successText: {
    color: "#82E6B2",
  },
  label: {
    color: brandColors.textSubtle,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 7,
    marginTop: 16,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor:
      brandColors.surfaceElevated,
    borderColor: brandColors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: brandColors.text,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: brandColors.accent,
    borderRadius: 15,
    height: 50,
    justifyContent: "center",
    marginTop: 22,
  },
  submitButtonText: {
    color: brandColors.background,
    fontSize: 13,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.65,
  },
  footnote: {
    color: brandColors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 24,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
