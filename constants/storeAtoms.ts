import { atom } from "jotai";

import errandsData from "../errands";
import { Contact, Errand, ID, List, User } from "./types";

// User active lists
let lists: List[] = [
  {
    id: "900f87",
    ownerId: "100001",
    title: "Personal",
    icon: "person",
    color: "blue",
    usersShared: ["100001"],
  },
  {
    id: "fsdf724",
    ownerId: "100006",
    title: "Cena fin de año",
    icon: "beer",
    color: "fuchsia",
    usersShared: ["100001", "100004", "100006"],
  },
  {
    id: "12439l",
    ownerId: "100001",
    title: "Supermercado",
    icon: "restaurant",
    color: "yellow",
    usersShared: ["100001", "100002", "100004"],
  },
  {
    id: "9dsmnb",
    ownerId: "100001",
    title: "Trabajo",
    icon: "business",
    color: "orange",
    usersShared: ["100001"],
  },
  {
    id: "9dwe32",
    ownerId: "100001",
    title: "Universidad",
    icon: "book",
    color: "green",
    usersShared: ["100001"],
  },
  {
    id: "po2531",
    ownerId: "100001",
    title: "Comprar casa",
    icon: "home",
    color: "lime",
    usersShared: ["100001", "100002", "100003", "100004"],
  },
  {
    id: "vi83724",
    ownerId: "100002",
    title: "Viaje Japón",
    icon: "airplane",
    color: "blue",
    usersShared: ["100001", "100002", "100003"],
  },
];

// User active
let userExample = {
  id: "100001",
  username: "manelmb9",
  displayName: "Manel Martinez Bel",
  name: "Manel",
  surname: "Martinez Bel",
  email: "manel.mb@example.com",
  phoneNumber: "+34-600-123-456",
  settings: {
    notifications: {
      notificationsEnabled: true,
      ownTasks: true,
      newMessages: true,
      newErrands: true,
      incomingReminders: true,
      changesInErrands: true,
    },
    language: "es",
    privacy: {
      profileVisibility: "friends",
      lastSeen: "contacts",
    },
  },
  photoURL: null,
  favoriteUsers: ["100002", "100004", "100006", "100008", "100012", "100016"],
  blockedUsers: ["100005", "1000015"],
  mutedUsers: {
    100004: {
      muteAll: false,
      muteMessages: true,
      muteNewErrands: false,
      muteReminders: false,
      muteChangesInErrands: false,
    },
    100005: {
      muteAll: true,
      muteMessages: true,
      muteNewErrands: true,
      muteReminders: true,
      muteChangesInErrands: true,
    },
    100006: {
      muteAll: true,
      muteMessages: true,
      muteNewErrands: true,
      muteReminders: true,
      muteChangesInErrands: true,
    },
    100007: {
      muteAll: true,
      muteMessages: true,
      muteNewErrands: true,
      muteReminders: true,
      muteChangesInErrands: true,
    },
    100008: {
      muteAll: false,
      muteMessages: false,
      muteNewErrands: true,
      muteReminders: false,
      muteChangesInErrands: true,
    },
  },
  contacts: [
    {
      id: "100002",
      displayName: "Carlos Fernández",
      name: "Carlos",
      surname: "Fernández",
      phoneNumbers: ["+34678901234"],
      emails: ["carlos.fernandez@email.com"],
    },
    {
      id: "100003",
      displayName: "María Gómez",
      name: "María",
      surname: "Gómez",
      phoneNumbers: ["+34612345678"],
    },
    {
      id: "100004",
      displayName: "Alejandro",
      name: "Alejandro",
      surname: "",
      phoneNumbers: ["+34655544332"],
      emails: ["alejandro.ruiz@email.com"],
    },
    {
      id: "100005",
      displayName: "Lucía Martínez Garcia Santos Barreiro Tortosa",
      name: "Lucía",
      surname: "Martínez Garcia Santos Barreiro Tortosa",
      phoneNumbers: ["+34699988877"],
    },
    {
      id: "100006",
      displayName: "Javier López",
      name: "Javier",
      surname: "López",
      phoneNumbers: ["+34677766655"],
      emails: ["javier.lopez@email.com"],
    },
    {
      id: "100007",
      displayName: "Sofía Hernández",
      name: "Sofía",
      surname: "Hernández",
      phoneNumbers: ["+34623456789"],
    },
    {
      id: "100008",
      displayName: "Daniel Pérez",
      name: "Daniel",
      surname: "Pérez",
      phoneNumbers: ["+34687654321"],
      emails: ["daniel.perez@email.com"],
    },
    {
      id: "100009",
      displayName: "Elena Díaz",
      name: "Elena",
      surname: "Díaz",
      phoneNumbers: ["+34611223344"],
    },
    {
      id: "100010",
      displayName: "Pedro Torres",
      name: "Pedro",
      surname: "Torres",
      phoneNumbers: ["+34655667788"],
      emails: ["pedro.torres@email.com"],
    },
    {
      id: "100011",
      displayName: "Natalia Romero",
      name: "Natalia",
      surname: "Romero",
      phoneNumbers: ["+34699887766"],
    },
    {
      id: "100012",
      displayName: "Hugo Sánchez",
      name: "Hugo",
      surname: "Sánchez",
      phoneNumbers: ["+34622334455"],
      emails: ["hugo.sanchez@email.com"],
    },
    {
      id: "100013",
      displayName: "Andrea Vargas",
      name: "Andrea",
      surname: "Vargas",
      phoneNumbers: ["+34633445566"],
    },
    {
      id: "100014",
      displayName: "Miguel Navarro",
      name: "Miguel",
      surname: "Navarro",
      phoneNumbers: ["+34644556677"],
      emails: ["miguel.navarro@email.com"],
    },
    {
      id: "1000015",
      displayName: "Laura Ortega",
      name: "Laura",
      surname: "Ortega",
      phoneNumbers: ["+34655667799"],
      username: "lauOrt01",
    },
    {
      id: "100016",
      displayName: "Fernando Castro",
      name: "Fernando",
      surname: "Castro",
      phoneNumbers: ["+34666778899"],
      emails: ["fernando.castro@email.com"],
    },
  ],
  createdAt: "2023-10-01T12:00:00.000Z",
  updatedAt: "2023-10-01T12:00:00.000Z",
  lastLogin: "2025-09-01T12:00:00.000Z",
} as const satisfies User;

export const userAtom = atom<User>(userExample);
export const errandsAtom = atom<Errand[]>(errandsData as Errand[]);
export const listsAtom = atom<List[]>(lists);

export const usersSharedWithAtom = atom<ID[]>([]);
export const currentErrandAtom = atom<Errand | null>(null);
export const currentListAtom = atom<List | null>(null);

export const userAssignedAtom = atom<User | { id: "unassigned"; name: string }>(
  userExample,
);
export const listAssignedAtom = atom<List | null>(null);

export const contactsAtom = atom<Contact[]>(userExample.contacts);