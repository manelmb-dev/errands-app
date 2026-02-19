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
  uid: string;
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
