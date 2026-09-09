"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { TeamMemberRow } from "@/lib/types/database";

export interface TeamMemberInput {
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  email: string;
  linkedin_url: string;
  visible: boolean;
}

function revalidateTeam() {
  revalidatePath("/admin/team");
  revalidatePath("/about");
}

export async function createTeamMember(input: TeamMemberInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("team_members").select("id", { count: "exact", head: true });

  const { data, error } = await supabase.from("team_members").insert({ ...input, position: count ?? 0 }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "team_members", entityId: data.id, metadata: { name: data.name } });
  revalidateTeam();
  return { ok: true as const, data: data as TeamMemberRow };
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_members").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "team_members", entityId: id, metadata: { name: data.name } });
  revalidateTeam();
  return { ok: true as const, data: data as TeamMemberRow };
}

export async function deleteTeamMember(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "team_members", entityId: id });
  revalidateTeam();
  return { ok: true as const };
}

export async function reorderTeamMember(id: string, direction: "up" | "down", members: TeamMemberRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const sorted = [...members].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((m) => m.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("team_members").update({ position: b.position }).eq("id", a.id),
    supabase.from("team_members").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "team_members", entityId: id });
  revalidateTeam();
  return { ok: true as const };
}
