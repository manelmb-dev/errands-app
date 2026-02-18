import { Priority, Repeat } from "../../constants/types";

export type ListIcon = string;
export type ListColor = string;

export type DraftList = {
  title: string;
  icon: ListIcon;
  color: ListColor;
  usersShared?: string[];
};

/**
 * A quién va asignada la tarea:
 * - unassigned: sin asignar
 * - candidate: texto que dijo el usuario ("Laura Ortega")
 * - resolved: ya resuelto por tu app a un id (opcional en IA, útil tras elegir en UI)
 */
export type AssignedUserRef =
  | { kind: "candidate"; query: string } // "Laura Ortega"
  | { kind: "resolved"; id: string; displayName?: string }; // id interno + nombre agenda

/**
 * A qué lista va:
 * - unassigned: ninguna
 * - candidate: texto que dijo el usuario ("Supermercado")
 * - resolved: ya resuelto por tu app a listId
 */
export type ListRef =
  | { kind: "unassigned"; id: "unassigned" }
  | { kind: "candidate"; query: string } // "Supermercado"
  | { kind: "resolved"; id: string; title?: string };

export type DraftTask = {
  title: string;

  // Optional
  description?: string;

  // Date & time
  dateErrand?: string;
  timeErrand?: string;

  // Notice (If user says it). Alternative: offsetMinutes.
  dateNotice?: string;
  timeNotice?: string;
  noticeOffsetMinutes?: number; // 60 = 1h before

  repeat?: Repeat;
  priority?: Priority;
  location?: string;

  assigned?: AssignedUserRef | null;
  list?: ListRef | null;
};

export type AiDraft =
  | { type: "list"; list: DraftList; tasks: DraftTask[] }
  | { type: "task"; task: DraftTask };
