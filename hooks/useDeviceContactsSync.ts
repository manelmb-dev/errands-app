import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import * as Contacts from "expo-contacts";
import { useEffect } from "react";

import {
  deviceContactsAtom,
  type DeviceContact,
} from "../constants/storeContactsAtom";
import { useAtom } from "jotai";

import { deleteContactsNotInDeviceIds, readAllDeviceContactsFromDb, readHashesByDeviceId, upsertManyDeviceContacts } from "../db/deviceContactsRepo";
import { normalizeToE164, uniq } from "../Utils/phone";
import { initDb } from "../db/sqliteDb";
import { makeContactHash, makePhonesHash } from "../Utils/hash";

const isString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export function useDeviceContactsSync(enabled: boolean) {
  const [, setDeviceContacts] = useAtom(deviceContactsAtom);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      // 0) init DB
      initDb();

      // 1) paint from sqlite cache immediately
      try {
        const cached = readAllDeviceContactsFromDb();
        if (!cancelled) setDeviceContacts(cached);
      } catch {}

      // 2) permissions
      const perm = await Contacts.getPermissionsAsync();
      if (perm.status !== "granted") {
        const asked = await Contacts.requestPermissionsAsync();
        if (asked.status !== "granted") {
          if (!cancelled) setDeviceContacts([]);
          return;
        }
      }

      // 3) region for parsing (device locale)
      const defaultRegion = Localization.getLocales()[0]?.regionCode ?? "ES";

      // 4) fetch contacts from device
      const res = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
        ],
        pageSize: 1000,
      });

      if (cancelled) return;

      // 5) read actual hashes
      const hashesById = readHashesByDeviceId();
      const now = Date.now();

      // 6) map and prepare upserts ONLY if it changed
      const toUpsert: Array<{
        deviceId: string;
        displayName: string;
        firstName?: string;
        lastName?: string;
        rawPhones: string[];
        e164Phones: string[];
        phonesHash: string;
        contactHash: string;
        now: number;
      }> = [];

      const deviceIds: string[] = [];

      // IMPORTANT: hashes SHA-256 are async, so we do a loop with awaits
      for (const c of res.data ?? []) {
        if (!c.id) continue;

        const firstName = c.firstName?.trim() || undefined;
        const lastName = c.lastName?.trim() || undefined;

        const displayName =
          c.name?.trim() ||
          `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
          "Unknown";

        const rawPhones =
          c.phoneNumbers?.map((p) => p.number).filter(isString) ?? [];

        const e164Phones = uniq(
          rawPhones
            .map((n) => normalizeToE164(n, defaultRegion))
            .filter((x): x is string => !!x),
        );

        // only contacts with phone number
        if (e164Phones.length === 0) continue;

        deviceIds.push(c.id);

        // hashes
        const phonesHash = await makePhonesHash(e164Phones);
        const contactHash = await makeContactHash({
          displayName,
          firstName,
          lastName,
          e164Phones,
        });

        const prev = hashesById[c.id];

        // if it does not exist or it changed => upsert
        if (
          !prev ||
          prev.phonesHash !== phonesHash ||
          prev.contactHash !== contactHash
        ) {
          toUpsert.push({
            deviceId: c.id,
            displayName,
            firstName,
            lastName,
            rawPhones,
            e164Phones,
            phonesHash,
            contactHash,
            now,
          });
        }
      }

      // 7) apply changes in SQLite
      if (toUpsert.length > 0) upsertManyDeviceContacts(toUpsert);

      // 8) delete all the ids from sqlite db that are not in the device anymore - deviceIds => actual ids in contacts device
      deleteContactsNotInDeviceIds(deviceIds);

      // 9) read final state from sqlite and pain atom
      const finalList: DeviceContact[] = readAllDeviceContactsFromDb();
      if (!cancelled) setDeviceContacts(finalList);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, setDeviceContacts]);
}