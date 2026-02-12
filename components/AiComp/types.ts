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
  title: string;
  description?: string;
  priority?: "none" | "low" | "medium" | "high";
};

export type AiDraft = {
  list: DraftList;
  tasks: DraftTask[];
};
