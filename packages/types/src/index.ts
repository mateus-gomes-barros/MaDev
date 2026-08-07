import type { Database } from "./database";

export type { Database } from "./database";

export type SkillMasteryState =
  Database["public"]["Enums"]["mastery_status"];

export type EvidenceType =
  Database["public"]["Enums"]["evidence_type"];

export interface Skill {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  order: number;
  isOfficial: boolean;
}

export interface UserSkillProgress {
  skillId: string;
  state: SkillMasteryState;
  updatedAt: string;
}