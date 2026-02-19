import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import * as Contacts from "expo-contacts";
import { useEffect } from "react";

import { DeviceContact, deviceContactsAtom } from "../constants/storeContactsAtom";
import { useAtom } from "jotai";

import { normalizeToE164, uniq } from "../Utils/phone";

const CACHE_KEY = "deviceContactsCache:v1";

export function useDeviceContactsSync(enabled: boolean) {
  const [, setDeviceContacts] = useAtom(deviceContactsAtom);

  const isString = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const defaultRegion = Localization.getLocales()[0]?.regionCode ?? "ES";

    const loadCacheFirst = async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (!cached) return;
        const parsed: DeviceContact[] = JSON.parse(cached);
        if (!cancelled) setDeviceContacts(parsed);
      } catch {}
    };

    const sync = async () => {
      // 1) show cache
      await loadCacheFirst();

      // 2) permissions
      const perm = await Contacts.getPermissionsAsync();
      if (perm.status !== "granted") {
        const asked = await Contacts.requestPermissionsAsync();
        if (asked.status !== "granted") {
          if (!cancelled) setDeviceContacts([]);
          await AsyncStorage.removeItem(CACHE_KEY);
          return;
        }
      }

      // 3) get device contacts
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

      // 4) map + filter only valid phone numbers
      const mapped: DeviceContact[] = (res.data ?? [])
        .filter((c) => !!c.id)
        .map((c) => {
          const firstName = c.firstName?.trim() || undefined;
          const lastName = c.lastName?.trim() || undefined;
          
          const displayName =
            c.name?.trim() ||
            `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
            "Unknown";
          
          const rawPhoneNumbers =
            c.phoneNumbers?.map((p) => p.number).filter(isString) ?? [];

          const e164PhoneNumbers = uniq(
            rawPhoneNumbers
              .map((n) => normalizeToE164(n, defaultRegion))
              .filter((x): x is string => !!x),
          );

          return {
            deviceId: c.id!,
            displayName,
            firstName,
            lastName,
            rawPhoneNumbers,
            e164PhoneNumbers,
            defaultRegionUsed: defaultRegion,
          };
        })
        // filter contacts with phone number
        .filter((dc) => dc.e164PhoneNumbers.length > 0);

      // 5) save in atom + cache
      setDeviceContacts(mapped);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [enabled, setDeviceContacts]);
}
