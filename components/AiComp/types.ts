export type ListIcon = string;
export type ListColor = string;

export type DraftList = {
  title: string;
  icon: ListIcon;
  color: ListColor;
  usersShared?: string[];
};

export type DraftTask = {
  id: string; // id temporal (preview)
  title: string;
  description?: string;

  // IA puede sugerir fecha/hora:
  dateErrand?: string; // "2026-02-13" (YYYY-MM-DD)
  timeErrand?: string; // "18:00" (HH:mm)

  // Aviso (opcional):
  dateNotice?: string;
  timeNotice?: string;

  priority?: "none" | "low" | "medium" | "high";

  // A quién va asignada (por nombre, luego lo resolvemos a id):
  assignedName?: string; // "Laura Ortega"
  assignedId?: string; // (si tu app ya lo puede resolver)
};

export type AiDraft =
  | { type: "list"; list: DraftList; tasks: DraftTask[] }
  | { type: "task"; task: DraftTask };
