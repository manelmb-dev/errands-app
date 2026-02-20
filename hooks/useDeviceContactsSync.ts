import * as Localization from "expo-localization";
import * as Contacts from "expo-contacts";
import { useEffect } from "react";
import { useAtom } from "jotai";

import {
  deviceContactsAtom,
  type DeviceContact,
} from "../constants/storeContactsAtom";

import {
  deleteContactsNotInDeviceIds,
  readAllDeviceContactsFromDb,
  readHashesByDeviceId,
  upsertManyDeviceContacts,
} from "../db/deviceContactsRepo";

import { makeContactHash, makePhonesHash } from "../Utils/hash";
import { normalizeToE164, uniq } from "../Utils/phone";
import { initDb } from "../db/sqliteDb";

const isString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export function useDeviceContactsSync(enabled: boolean) {
  const [, setDeviceContacts] = useAtom(deviceContactsAtom);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      // 0) Init DB
      initDb();

      // 1) Paint UI immediately from SQLite cache (fast startup)
      try {
        const cached = readAllDeviceContactsFromDb();
        if (!cancelled) setDeviceContacts(cached);
      } catch {}

      // 2) Permissions (request if needed)
      const perm = await Contacts.getPermissionsAsync();
      if (perm.status !== "granted") {
        const asked = await Contacts.requestPermissionsAsync();
        if (asked.status !== "granted") {
          if (!cancelled) setDeviceContacts([]);
          return;
        }
      }

      // Optional: iOS "limited" access (iOS 18+). If you want "all contacts",
      // you can ask the user to extend access using the system picker.
      const perm2 = await Contacts.getPermissionsAsync();
      if (perm2.status === "granted" && perm2.accessPrivileges === "limited") {
        await Contacts.presentAccessPickerAsync();
      }

      // 3) Default region for phone parsing (device locale)
      const defaultRegion = Localization.getLocales()[0]?.regionCode ?? "ES";

      // 4) Contact fields to fetch
      const fields = [
        Contacts.Fields.FirstName,
        Contacts.Fields.LastName,
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
      ];

      // 5) Paginate through the whole address book
      const PAGE_SIZE = 500;
      let pageOffset = 0;
      let hasNextPage = true;

      // 6) Load existing hashes
      const hashesById = readHashesByDeviceId();

      // 7) Collect all device IDs across all pages (used for cleanup)
      const allDeviceIds: string[] = [];

      // 8) Use a single timestamp for this sync run
      const now = Date.now();

      while (hasNextPage) {
        const page = await Contacts.getContactsAsync({
          fields,
          pageSize: PAGE_SIZE,
          pageOffset,
        });

        if (cancelled) return;

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

        // IMPORTANT: SHA-256 hashing is async, so we loop with awaits
        for (const c of page.data ?? []) {
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

          // Only keep contacts that actually have a valid phone number
          if (e164Phones.length === 0) continue;

          allDeviceIds.push(c.id);

          // Compute hashes for change detection
          const phonesHash = await makePhonesHash(e164Phones);
          const contactHash = await makeContactHash({
            displayName,
            firstName,
            lastName,
            e164Phones,
          });

          const prev = hashesById[c.id];

          // If it doesn't exist in DB or it changed => upsert
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

            // Update in-memory cache so subsequent pages compare correctly
            hashesById[c.id] = { phonesHash, contactHash };
          }
        }

        // Apply DB changes page-by-page (keeps memory usage low)
        if (toUpsert.length > 0) upsertManyDeviceContacts(toUpsert);

        // Move to next page
        hasNextPage = !!page.hasNextPage;
        pageOffset += PAGE_SIZE;
      }

      // 9) Remove from SQLite any contacts that no longer exist on the device
      deleteContactsNotInDeviceIds(allDeviceIds);

      // 10) Read final state from SQLite and paint atom
      const finalList: DeviceContact[] = readAllDeviceContactsFromDb();
      if (!cancelled) setDeviceContacts(finalList);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, setDeviceContacts]);
}
