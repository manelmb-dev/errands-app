export type ListIcon = string;
export type ListColor = string;

export type DraftList = {
  title: string;
  icon: ListIcon;
  color: ListColor;
  usersShared?: string[];
};

export type DraftTask = {
  id: string;
  ownerId: string;
  assignedId?: string;
  title: string;
  description?: string;
  dateErrand?: string;
  timeErrand?: string;
  completed: boolean;
  dateNotice?: string;
  timeNotice?: string;
  repeat?: "never" | "daily" | "weekDays" | "weekendDays" | "weekly" | "monthly" | "yearly";
  priority?: "none" | "low" | "medium" | "high";
  marked: boolean;
  location?: string;
  listId: string;
  completedDateErrand?: string | null,
  completedTimeErrand?: string | null,
  completedBy?: string | null;
  seen: boolean;
  deleted: boolean;

  // A quién va asignada (por nombre, luego lo resolvemos a id):
  assignedName?: string; // "Laura Ortega"
};

export type AiDraft =
  | { type: "list"; list: DraftList; tasks: DraftTask[] }
  | { type: "task"; task: DraftTask };
