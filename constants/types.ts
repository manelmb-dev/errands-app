export type ID = string;

export type Contact = {
  id: ID;
  displayName: string; // use for matching AI
  name?: string;
  surname?: string;
  phoneNumbers: string[];
  emails?: string[];
  username?: string;
};

export type List = {
  id: ID;
  ownerId: ID;
  title: string;
  icon: string;
  color: string;
  usersShared: ID[];
};

export type Repeat =
  | "never"
  | "daily"
  | "weekDays"
  | "weekendDays"
  | "weekly"
  | "monthly"
  | "yearly";

export type Priority = "none" | "low" | "medium" | "high";

export type Errand = {
  id: ID;
  ownerId: ID;
  assignedId?: ID | "unassigned";
  listId?: ID | "unassigned";
  title: string;
  description?: string;
  completed: boolean;
  marked: boolean;
  deleted: boolean;
  dateErrand?: string | null;
  timeErrand?: string | null;
  dateNotice?: string | null;
  timeNotice?: string | null;
  repeat: Repeat;
  location?: string | null;
  priority: Priority;
  completedDateErrand?: string | null;
  completedTimeErrand?: string | null;
  completedBy?: ID | null;
  seen: boolean;
};

export type UserSettings = {
  notifications: {
    notificationsEnabled: boolean;
    ownTasks: boolean;
    newMessages: boolean;
    newErrands: boolean;
    incomingReminders: boolean;
    changesInErrands: boolean;
  };
  language: "es" | "en" | "ca";
  privacy: {
    profileVisibility: "friends" | "public" | "private";
    lastSeen: "contacts" | "everyone" | "nobody";
  };
};

export type ISODateString = string;

export type User = {
  id: ID;
  username: string;
  name: string;
  surname: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string | null;
  favoriteUsers: ID[];
  blockedUsers: ID[];
  mutedUsers: Record<
    ID,
    {
      muteAll: boolean;
      muteMessages: boolean;
      muteNewErrands: boolean;
      muteReminders: boolean;
      muteChangesInErrands: boolean;
    }
  >;
  contacts: Contact[];
  settings: UserSettings;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastLogin?: ISODateString;
};
