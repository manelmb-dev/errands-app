// db/deviceContactsRepo.ts
import { sqliteDb } from "./sqliteDb";
import { DeviceContact } from "../constants/storeContactsAtom";

type DbRow = {
  deviceId: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  rawPhonesJson: string;
  e164PhonesJson: string;
  phonesHash: string;
  contactHash: string;
  updatedAt: number;
};

export function readAllDeviceContactsFromDb(): DeviceContact[] {
  const rows = sqliteDb.getAllSync<DbRow>(`
    SELECT deviceId, displayName, firstName, lastName,
           rawPhonesJson, e164PhonesJson,
           phonesHash, contactHash, updatedAt
    FROM device_contacts
    ORDER BY displayName COLLATE NOCASE ASC;
  `);

  return rows.map((r) => ({
    deviceId: r.deviceId,
    displayName: r.displayName,
    firstName: r.firstName ?? undefined,
    lastName: r.lastName ?? undefined,
    rawPhoneNumbers: JSON.parse(r.rawPhonesJson || "[]"),
    e164PhoneNumbers: JSON.parse(r.e164PhonesJson || "[]"),
  }));
}

export function readHashesByDeviceId(): Record<
  string,
  { phonesHash: string; contactHash: string }
> {
  const rows = sqliteDb.getAllSync<{
    deviceId: string;
    phonesHash: string;
    contactHash: string;
  }>(`SELECT deviceId, phonesHash, contactHash FROM device_contacts;`);

  const map: Record<string, { phonesHash: string; contactHash: string }> = {};
  for (const r of rows)
    map[r.deviceId] = { phonesHash: r.phonesHash, contactHash: r.contactHash };
  return map;
}

export function upsertManyDeviceContacts(
  contacts: Array<{
    deviceId: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    rawPhones: string[];
    e164Phones: string[];
    phonesHash: string;
    contactHash: string;
    now: number;
  }>,
) {
  sqliteDb.execSync("BEGIN;");

  try {
    const stmt = sqliteDb.prepareSync(`
      INSERT INTO device_contacts
        (deviceId, displayName, firstName, lastName, rawPhonesJson, e164PhonesJson, phonesHash, contactHash, updatedAt)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(deviceId) DO UPDATE SET
        displayName=excluded.displayName,
        firstName=excluded.firstName,
        lastName=excluded.lastName,
        rawPhonesJson=excluded.rawPhonesJson,
        e164PhonesJson=excluded.e164PhonesJson,
        phonesHash=excluded.phonesHash,
        contactHash=excluded.contactHash,
        updatedAt=excluded.updatedAt;
    `);

    for (const c of contacts) {
      stmt.executeSync([
        c.deviceId,
        c.displayName,
        c.firstName ?? null,
        c.lastName ?? null,
        JSON.stringify(c.rawPhones),
        JSON.stringify(c.e164Phones),
        c.phonesHash,
        c.contactHash,
        c.now,
      ]);
    }

    sqliteDb.execSync("COMMIT;");
  } catch (e) {
    sqliteDb.execSync("ROLLBACK;");
    throw e;
  }
}

export function deleteContactsNotInDeviceIds(deviceIds: string[]) {
  if (deviceIds.length === 0) {
    sqliteDb.execSync("DELETE FROM device_contacts;");
    return;
  }

  sqliteDb.execSync(
    `CREATE TEMP TABLE IF NOT EXISTS tmp_keep_ids (deviceId TEXT PRIMARY KEY NOT NULL);`,
  );
  sqliteDb.execSync(`DELETE FROM tmp_keep_ids;`);
  sqliteDb.execSync("BEGIN;");

  try {
    const stmt = sqliteDb.prepareSync(
      `INSERT OR IGNORE INTO tmp_keep_ids (deviceId) VALUES (?);`,
    );
    for (const id of deviceIds) stmt.executeSync([id]);
    sqliteDb.execSync("COMMIT;");
  } catch (e) {
    sqliteDb.execSync("ROLLBACK;");
    throw e;
  }

  // Borra los que ya no existen en el device
  sqliteDb.execSync(`
    DELETE FROM device_contacts
    WHERE deviceId NOT IN (SELECT deviceId FROM tmp_keep_ids);
  `);

  sqliteDb.execSync(`DROP TABLE tmp_keep_ids;`);
}
