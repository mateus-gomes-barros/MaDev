import type { Database } from "@madev/types";

export interface TrackCatalogChecklistItem {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  position: number;
  isRequired: boolean;
  estimatedMinutes: number | null;
}

export interface TrackCatalogChecklist {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  items: TrackCatalogChecklistItem[];
}

export interface TrackCatalogSkill {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  position: number;
  estimatedHours: number | null;
  isRequired: boolean;
  source:
    Database["public"]["Enums"]["content_source"];
  prerequisiteSkillIds: string[];
  checklists: TrackCatalogChecklist[];
}

export interface TrackCatalogPhase {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  estimatedHours: number | null;
  skills: TrackCatalogSkill[];
}

export interface TrackCatalog {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  position: number;
  phases: TrackCatalogPhase[];
}
