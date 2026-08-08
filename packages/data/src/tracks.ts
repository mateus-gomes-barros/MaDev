import type { Database } from "@madev/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  TrackCatalog,
  TrackCatalogChecklist,
  TrackCatalogChecklistItem,
  TrackCatalogPhase,
  TrackCatalogSkill,
} from "./types";

export const FULL_STACK_TRACK_SLUG = "full-stack";

type MaDevSupabaseClient =
  SupabaseClient<Database>;

function sortByPosition<
  T extends {
    position: number;
  },
>(items: T[]): T[] {
  return [...items].sort(
    (first, second) =>
      first.position - second.position,
  );
}

export async function getPublishedTrackBySlug(
  client: MaDevSupabaseClient,
  slug: string,
): Promise<TrackCatalog | null> {
  const { data, error } = await client
    .from("tracks")
    .select(`
      id,
      slug,
      name,
      description,
      icon,
      position,
      phases (
        id,
        slug,
        name,
        description,
        position,
        estimated_hours,
        skills (
          id,
          slug,
          name,
          description,
          category,
          position,
          estimated_hours,
          is_required,
          source,
          prerequisites:skill_prerequisites!skill_prerequisites_skill_id_fkey (
            prerequisite_skill_id
          ),
          official_checklists (
            id,
            slug,
            title,
            description,
            position,
            checklist_items (
              id,
              slug,
              title,
              description,
              position,
              is_required,
              estimated_minutes
            )
          )
        )
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("phases.is_published", true)
    .eq("phases.skills.is_published", true)
    .eq(
      "phases.skills.official_checklists.is_published",
      true,
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load track "${slug}": ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  const phases: TrackCatalogPhase[] =
    sortByPosition(data.phases ?? []).map(
      (phase) => {
        const skills: TrackCatalogSkill[] =
          sortByPosition(phase.skills ?? []).map(
            (skill) => {
              const checklists:
                TrackCatalogChecklist[] =
                sortByPosition(
                  skill.official_checklists ?? [],
                ).map((checklist) => {
                  const items:
                    TrackCatalogChecklistItem[] =
                    sortByPosition(
                      checklist.checklist_items ?? [],
                    ).map((item) => ({
                      id: item.id,
                      slug: item.slug,
                      title: item.title,
                      description:
                        item.description,
                      position: item.position,
                      isRequired:
                        item.is_required,
                      estimatedMinutes:
                        item.estimated_minutes,
                    }));

                  return {
                    id: checklist.id,
                    slug: checklist.slug,
                    title: checklist.title,
                    description:
                      checklist.description,
                    position: checklist.position,
                    items,
                  };
                });

              return {
                id: skill.id,
                slug: skill.slug,
                name: skill.name,
                description: skill.description,
                category: skill.category,
                position: skill.position,
                estimatedHours:
                  skill.estimated_hours,
                isRequired: skill.is_required,
                source: skill.source,
                prerequisiteSkillIds: (
                  skill.prerequisites ?? []
                ).map(
                  (prerequisite) =>
                    prerequisite
                      .prerequisite_skill_id,
                ),
                checklists,
              };
            },
          );

        return {
          id: phase.id,
          slug: phase.slug,
          name: phase.name,
          description: phase.description,
          position: phase.position,
          estimatedHours:
            phase.estimated_hours,
          skills,
        };
      },
    );

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    icon: data.icon,
    position: data.position,
    phases,
  };
}

export function getFullStackTrack(
  client: MaDevSupabaseClient,
): Promise<TrackCatalog | null> {
  return getPublishedTrackBySlug(
    client,
    FULL_STACK_TRACK_SLUG,
  );
}
