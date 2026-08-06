export type SkillMasteryState =
  | "not_started"
  | "studying"
  | "understands_concept"
  | "practiced"
  | "used_in_project"
  | "independent"
  | "can_teach";

export type EvidenceType =
  | "github_repository"
  | "deployment"
  | "project"
  | "image"
  | "certificate"
  | "note"
  | "professional_experience";

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
