import * as FileSystem from 'expo-file-system';
import { getDb } from '../db';

export async function exportData(): Promise<string> {
  const tables = ['people', 'important_dates', 'follow_ups', 'gift_ideas', 'notes', 'nudges', 'settings', 'purchases', 'widget_config'];
  const payload = Object.fromEntries(tables.map((table) => [table, getDb().getAllSync(`SELECT * FROM ${table}`)]));
  const uri = `${FileSystem.cacheDirectory}nudge-backup-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
  return uri;
}
