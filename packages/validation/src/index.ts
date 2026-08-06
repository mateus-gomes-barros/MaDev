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
  description: z.string().trim().max(500).optional(),
  careerId: z.string().uuid(),
});

export type CustomSkillInput = z.infer<typeof customSkillSchema>;
