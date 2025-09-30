import { atom } from "jotai";

import errandsData from "../errands";

// User active lists
let lists = [
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
  photoURL: false,
  favoriteUsers: [100002, 100004, 100006, 100008, 100012, 100016],
  blockedUsers: [],
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
      name: "Carlos",
      surname: "Fernández",
      phoneNumber: "+34678901234",
      email: "carlos.fernandez@email.com",
    },
    {
      id: "100003",
      name: "María",
      surname: "Gómez",
      phoneNumber: "+34612345678",
    },
    {
      id: "100004",
      name: "Alejandro",
      surname: "",
      phoneNumber: "+34655544332",
      email: "alejandro.ruiz@email.com",
    },
    {
      id: "100005",
      name: "Lucía",
      surname: "Martínez Garcia Santos Barreiro",
      phoneNumber: "+34699988877",
    },
    {
      id: "100006",
      name: "Javier",
      surname: "López",
      phoneNumber: "+34677766655",
      email: "javier.lopez@email.com",
    },
    {
      id: "100007",
      name: "Sofía",
      surname: "Hernández",
      phoneNumber: "+34623456789",
    },
    {
      id: "100008",
      name: "Daniel",
      surname: "Pérez",
      phoneNumber: "+34687654321",
      email: "daniel.perez@email.com",
    },
    {
      id: "100009",
      name: "Elena",
      surname: "Díaz",
      phoneNumber: "+34611223344",
    },
    {
      id: "100010",
      name: "Pedro",
      surname: "Torres",
      phoneNumber: "+34655667788",
      email: "pedro.torres@email.com",
    },
    {
      id: "100011",
      name: "Natalia",
      surname: "Romero",
      phoneNumber: "+34699887766",
    },
    {
      id: "100012",
      name: "Hugo",
      surname: "Sánchez",
      phoneNumber: "+34622334455",
      email: "hugo.sanchez@email.com",
    },
    {
      id: "100013",
      name: "Andrea",
      surname: "Vargas",
      phoneNumber: "+34633445566",
    },
    {
      id: "100014",
      name: "Miguel",
      surname: "Navarro",
      phoneNumber: "+34644556677",
      email: "miguel.navarro@email.com",
    },
    {
      id: "1000015",
      name: "Laura",
      surname: "Ortega",
      phoneNumber: "+34655667799",
    },
    {
      id: "100016",
      name: "Fernando",
      surname: "Castro",
      phoneNumber: "+34666778899",
      email: "fernando.castro@email.com",
    },
  ],
  createdAt: "2023-10-01T12:00:00.000Z",
  updatedAt: "2023-10-01T12:00:00.000Z",
  lastLogin: "2025-09-01T12:00:00.000Z",
};

export const userAtom = atom(userExample);
export const errandsAtom = atom(errandsData);
export const listsAtom = atom(lists);
export const usersSharedWithAtom = atom([]);
export const currentErrandAtom = atom(null);
export const currentListAtom = atom(null);
export const userAssignedAtom = atom(userExample);
export const listAssignedAtom = atom(false);
export const contactsAtom = atom(userExample.contacts);
export const themeAtom = atom("light");
export const languageAtom = atom("es");
