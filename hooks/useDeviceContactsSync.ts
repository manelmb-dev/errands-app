import { useEffect } from "react";
import * as Contacts from "expo-contacts";

import { useAtom } from "jotai";
import { contactsAtom } from "../constants/storeAtoms";

import type { Contact } from "../constants/types";

const isString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export function useDeviceContactsSync(enabled: boolean) {
  const [, setContacts] = useAtom(contactsAtom);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      const perm = await Contacts.getPermissionsAsync();
      if (perm.status !== "granted") {
        const asked = await Contacts.requestPermissionsAsync();
        if (asked.status !== "granted") {
          if (!cancelled) setContacts([]);
          return;
        }
      }

      const res = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
        pageSize: 1000,
      });

      if (cancelled) return;

      const mapped: Contact[] = res.data
        .filter((c) => !!c.id)
        .map((c) => {
          const firstName = c.firstName?.trim() ?? "";
          const lastName = c.lastName?.trim() ?? "";
          const displayName =
            c.name?.trim() || `${firstName} ${lastName}`.trim() || "Unknown";

          const phoneNumbers =
            c.phoneNumbers?.map((p) => p.number).filter(isString) ?? [];

          const emails = c.emails?.map((e) => e.email).filter(isString) ?? [];

          return {
            id: c.id!,
            displayName,
            name: firstName || undefined,
            surname: lastName || undefined,
            phoneNumbers,
            emails: emails.length ? emails : undefined,
          };
        })
        .filter((c) => c.phoneNumbers.length > 0);

      setContacts(mapped);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, setContacts]);
}
