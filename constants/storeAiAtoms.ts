import { atom } from "jotai";

import type { AiDraft } from "../components/AiComp/types";

export const aiStepAtom = atom<"prompt" | "preview">("prompt");
export const aiPromptAtom = atom<string>("");

export const aiDraftAtom = atom<AiDraft | null>(null);
export const aiSelectedTaskIdsAtom = atom<string[]>([]);

export const aiLoadingAtom = atom<boolean>(false);
export const aiErrorAtom = atom<string | null>(null);


type AssignedUserRef =
  | { kind: "unassigned"; id: "unassigned" }
  | {
      kind: "user";
      id: string;
      displayName?: string;
      localContactId?: string;
      phoneNumber?: string;
    };

type AssignedList =
  | { kind: "unassigned"; id: "unassigned" }
  | { kind: "list"; id: string };

export const aiUserAssignedAtom = atom<AssignedUserRef>({
  kind: "unassigned",
  id: "unassigned",
});
export const aiListAssignedAtom = atom<AssignedList | null>({ kind: "unassigned", id: "unassigned" });
