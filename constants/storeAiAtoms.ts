import { atom } from "jotai";

import type { AiDraft, AssignedUserRef, ListRef } from "../components/AiComp/types";

export const aiStepAtom = atom<"prompt" | "preview">("prompt");
export const aiPromptAtom = atom<string>("");

export const aiDraftAtom = atom<AiDraft | null>(null);
export const aiSelectedTaskIdsAtom = atom<string[]>([]);

export const aiLoadingAtom = atom<boolean>(false);
export const aiErrorAtom = atom<string | null>(null);

export const aiUserAssignedAtom = atom<AssignedUserRef | null>(null);
export const aiListAssignedAtom = atom<ListRef | null>(null);
