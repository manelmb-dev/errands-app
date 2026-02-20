import * as SQLite from "expo-sqlite";

export const sqliteDb = SQLite.openDatabaseSync("errands.sqlite");

export function initDb() {
  sqliteDb.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS device_contacts (
      deviceId TEXT PRIMARY KEY NOT NULL,
      displayName TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      e164PhonesJson TEXT NOT NULL,
      phonesHash TEXT NOT NULL,
      contactHash TEXT NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resolved_contacts (
      deviceId TEXT PRIMARY KEY NOT NULL,
      errandsUid TEXT,
      matchedPhoneE164 TEXT,
      resolvedAt INTEGER NOT NULL,
      FOREIGN KEY (deviceId) REFERENCES device_contacts(deviceId) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_resolved_errandsUid ON resolved_contacts(errandsUid);
  `);
}
