import { atom } from "jotai";

// device contacts
export type DeviceContact = {
  deviceId: string; // device id Expo Contacts
  displayName: string; // for UI and matching with AI
  firstName?: string;
  lastName?: string;

  // device phone numbers
  rawPhoneNumbers: string[];

  // normalized phone numbers
  e164PhoneNumbers: string[];

  defaultRegionUsed?: string; // "ES", "US"...
};

export type AppUserMini = {
  id: string;
  displayName: string;
  phoneE164: string; // for matching
  userName: string;
  photoURL?: string;
};

export type ResolvedContact = {
  device: DeviceContact;
  appUser?: AppUserMini; // if contact is an existing errand user
};

export const deviceContactsAtom = atom<DeviceContact[]>([]);

// key: e164 phone, value: user mini
export const errandsUsersByPhoneAtom = atom<Record<string, AppUserMini>>({});

// opcional: cuando el usuario elige manualmente un match ambiguo
export const contactLinkOverridesAtom = atom<Record<string, string>>({});
// deviceId -> appUserId



// contacts: [
//     {
//       id: "100002",
//       displayName: "Carlos Fernández",
//       name: "Carlos",
//       surname: "Fernández",
//       phoneNumbers: ["+34678901234"],
//       emails: ["carlos.fernandez@email.com"],
//     },
//     {
//       id: "100003",
//       displayName: "María Gómez",
//       name: "María",
//       surname: "Gómez",
//       phoneNumbers: ["+34612345678"],
//     },
//     {
//       id: "100004",
//       displayName: "Alejandro",
//       name: "Alejandro",
//       surname: "",
//       phoneNumbers: ["+34655544332"],
//       emails: ["alejandro.ruiz@email.com"],
//     },
//     {
//       id: "100005",
//       displayName: "Lucía Martínez Garcia Santos Barreiro Tortosa",
//       name: "Lucía",
//       surname: "Martínez Garcia Santos Barreiro Tortosa",
//       phoneNumbers: ["+34699988877"],
//     },
//     {
//       id: "100006",
//       displayName: "Javier López",
//       name: "Javier",
//       surname: "López",
//       phoneNumbers: ["+34677766655"],
//       emails: ["javier.lopez@email.com"],
//     },
//     {
//       id: "100007",
//       displayName: "Sofía Hernández",
//       name: "Sofía",
//       surname: "Hernández",
//       phoneNumbers: ["+34623456789"],
//     },
//     {
//       id: "100008",
//       displayName: "Daniel Pérez",
//       name: "Daniel",
//       surname: "Pérez",
//       phoneNumbers: ["+34687654321"],
//       emails: ["daniel.perez@email.com"],
//     },
//     {
//       id: "100009",
//       displayName: "Elena Díaz",
//       name: "Elena",
//       surname: "Díaz",
//       phoneNumbers: ["+34611223344"],
//     },
//     {
//       id: "100010",
//       displayName: "Pedro Torres",
//       name: "Pedro",
//       surname: "Torres",
//       phoneNumbers: ["+34655667788"],
//       emails: ["pedro.torres@email.com"],
//     },
//     {
//       id: "100011",
//       displayName: "Natalia Romero",
//       name: "Natalia",
//       surname: "Romero",
//       phoneNumbers: ["+34699887766"],
//     },
//     {
//       id: "100012",
//       displayName: "Hugo Sánchez",
//       name: "Hugo",
//       surname: "Sánchez",
//       phoneNumbers: ["+34622334455"],
//       emails: ["hugo.sanchez@email.com"],
//     },
//     {
//       id: "100013",
//       displayName: "Andrea Vargas",
//       name: "Andrea",
//       surname: "Vargas",
//       phoneNumbers: ["+34633445566"],
//     },
//     {
//       id: "100014",
//       displayName: "Miguel Navarro",
//       name: "Miguel",
//       surname: "Navarro",
//       phoneNumbers: ["+34644556677"],
//       emails: ["miguel.navarro@email.com"],
//     },
//     {
//       id: "1000015",
//       displayName: "Laura Ortega",
//       name: "Laura",
//       surname: "Ortega",
//       phoneNumbers: ["+34655667799"],
//       username: "lauOrt01",
//     },
//     {
//       id: "100016",
//       displayName: "Fernando Castro",
//       name: "Fernando",
//       surname: "Castro",
//       phoneNumbers: ["+34666778899"],
//       emails: ["fernando.castro@email.com"],
//     },
//   ],