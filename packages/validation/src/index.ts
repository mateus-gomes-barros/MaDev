import { z } from "zod";

export const skillMasteryStateSchema = z.enum([
  "not_started",
  "studying",
  "understands_concept",
  "practiced",
  "used_in_project",
  "independent",
  "can_teach",
]);

export const customSkillSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z
    .string()
    .trim()
    .max(500)
    .optional(),
  careerId: z.string().uuid(),
});

export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .trim()
    .min(1, "Informe sua senha."),
});

export const signUpCredentialsSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Informe seu e-mail.")
      .email("Informe um e-mail válido."),
    password: z
      .string()
      .trim()
      .min(
        8,
        "A senha deve ter pelo menos 8 caracteres.",
      ),
    passwordConfirmation: z
      .string()
      .trim()
      .min(1, "Confirme sua senha."),
  })
  .refine(
    (credentials) =>
      credentials.password ===
      credentials.passwordConfirmation,
    {
      message: "As senhas não coincidem.",
      path: ["passwordConfirmation"],
    },
  );

export type CustomSkillInput = z.infer<
  typeof customSkillSchema
>;

export type LoginCredentials = z.infer<
  typeof loginCredentialsSchema
>;

export type SignUpCredentials = z.infer<
  typeof signUpCredentialsSchema
>;
