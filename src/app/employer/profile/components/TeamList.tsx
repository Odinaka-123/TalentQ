"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import TeamMemberRow from "./TeamMemberRow";
import InviteTeamMemberModal, { InviteDraft } from "./InviteTeamMemberModal";
import { createClient } from "@/lib/supabase/client";
import { inviteTeamMember, removeTeamMember } from "@/lib/mutations/team";
import type { TeamMemberRow as TeamMemberRowData } from "@/lib/queries/employer-profile";

type TeamListProps = {
  employerId: string;
  team: TeamMemberRowData[];
  onTeamChange: (team: TeamMemberRowData[]) => void;
};

const avatarPalette = ["#3E7AC7", "#3E8E5A", "#DE814A", "#C755A0", "#A8531E"];

function colorForId(id: string) {
  const hash = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return avatarPalette[hash % avatarPalette.length];
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function firstOrSelf<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default function TeamList({
  employerId,
  team,
  onTeamChange,
}: TeamListProps) {
  const supabase = createClient();
  const [modalOpen, setModalOpen] = useState(false);

  const handleInvite = async (draft: InviteDraft) => {
    const newMember = await inviteTeamMember(supabase, employerId, draft);
    onTeamChange([{ ...newMember, profiles: null }, ...team]);
  };

  const handleRemove = async (memberId: string) => {
    await removeTeamMember(supabase, memberId);
    onTeamChange(team.filter((m) => m.id !== memberId));
  };

  return (
    <>
      <div className="rounded-2xl bg-white px-6 py-2 shadow-[0px_4px_4px_-3px_#DE814A,inset_0px_4px_4px_-2px_#DE814A]">
        <div className="flex items-center justify-between py-4">
          <h3 className="text-sm font-semibold text-[#1F2A22]">Team Members</h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#A8531E] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#94481A] transition-colors"
          >
            <Plus size={13} />
            Invite Member
          </button>
        </div>

        {team.length === 0 ?
          <p className="text-sm text-[#8A8A7E] text-center py-8">
            No team members yet.
          </p>
        : <div className="flex flex-col divide-y divide-[#EFEBE2]">
            {team.map((member) => {
              const linkedProfile = firstOrSelf(member.profiles);
              const displayName = linkedProfile?.full_name ?? member.email;

              return (
                <TeamMemberRow
                  key={member.id}
                  initials={initialsFor(displayName)}
                  avatarColor={colorForId(member.id)}
                  name={displayName}
                  role={member.role}
                  status={member.status}
                  onRemove={() => handleRemove(member.id)}
                />
              );
            })}
          </div>
        }
      </div>

      {modalOpen && (
        <InviteTeamMemberModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleInvite}
        />
      )}
    </>
  );
}
