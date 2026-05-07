import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('nudge.db');

const migrations = [
  `CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    relationshipType TEXT NOT NULL,
    nickname TEXT,
    birthday TEXT,
    anniversary TEXT,
    photoUri TEXT,
    accentColor TEXT,
    archivedAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS important_dates (
    id TEXT PRIMARY KEY NOT NULL,
    personId TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    isRecurring INTEGER NOT NULL,
    leadDays INTEGER NOT NULL,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS follow_ups (
    id TEXT PRIMARY KEY NOT NULL,
    personId TEXT NOT NULL,
    title TEXT NOT NULL,
    context TEXT,
    dueAt TEXT NOT NULL,
    status TEXT NOT NULL,
    snoozedUntil TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS gift_ideas (
    id TEXT PRIMARY KEY NOT NULL,
    personId TEXT NOT NULL,
    title TEXT NOT NULL,
    notes TEXT,
    url TEXT,
    priceRange TEXT,
    occasion TEXT,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY NOT NULL,
    personId TEXT NOT NULL,
    body TEXT NOT NULL,
    tag TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS nudges (
    id TEXT PRIMARY KEY NOT NULL,
    personId TEXT,
    sourceType TEXT NOT NULL,
    sourceId TEXT,
    title TEXT NOT NULL,
    supportingText TEXT NOT NULL,
    whyNow TEXT NOT NULL,
    score INTEGER NOT NULL,
    state TEXT NOT NULL,
    scheduledFor TEXT NOT NULL,
    snoozedUntil TEXT,
    completedAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    notificationsEnabled INTEGER NOT NULL,
    quietHoursStart TEXT NOT NULL,
    quietHoursEnd TEXT NOT NULL,
    theme TEXT NOT NULL,
    passcodeEnabled INTEGER NOT NULL,
    freeTierPeopleLimit INTEGER NOT NULL,
    freeTierItemLimit INTEGER NOT NULL,
    onboardingCompleted INTEGER NOT NULL
  );`,
  `INSERT OR IGNORE INTO settings (id, notificationsEnabled, quietHoursStart, quietHoursEnd, theme, passcodeEnabled, freeTierPeopleLimit, freeTierItemLimit, onboardingCompleted)
   VALUES (1, 1, '22:00', '07:00', 'light', 0, 3, 40, 0);`,
  `CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    unlocked INTEGER NOT NULL,
    purchasedAt TEXT
  );`,
  `INSERT OR IGNORE INTO purchases (id, unlocked) VALUES (1, 0);`,
  `CREATE TABLE IF NOT EXISTS widget_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    mode TEXT NOT NULL,
    preferredRelationship TEXT
  );`,
  `INSERT OR IGNORE INTO widget_config (id, mode) VALUES (1, 'simple');`
];

export async function initializeDatabase() {
  for (const statement of migrations) {
    db.execSync(statement);
  }
}

export function getDb() {
  return db;
}
