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
      rawPhonesJson TEXT NOT NULL,
      e164PhonesJson TEXT NOT NULL,
      phonesHash TEXT NOT NULL,
      contactHash TEXT NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_device_contacts_displayName
      ON device_contacts(displayName);
  `);
}