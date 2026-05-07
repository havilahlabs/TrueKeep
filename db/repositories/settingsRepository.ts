import { getDb } from '../index';
import { AppSettings, PurchaseState } from '../../types/models';

export const settingsRepository = {
  getSettings(): AppSettings {
    return getDb().getFirstSync<AppSettings>('SELECT notificationsEnabled, quietHoursStart, quietHoursEnd, theme, passcodeEnabled, freeTierPeopleLimit, freeTierItemLimit, onboardingCompleted FROM settings WHERE id = 1')!;
  },
  setOnboardingCompleted() {
    getDb().runSync('UPDATE settings SET onboardingCompleted = 1 WHERE id = 1');
  },
  getPurchaseState(): PurchaseState {
    return getDb().getFirstSync<PurchaseState>('SELECT id, unlocked, purchasedAt FROM purchases WHERE id = 1')!;
  },
  unlock() {
    getDb().runSync('UPDATE purchases SET unlocked = 1, purchasedAt = ? WHERE id = 1', [new Date().toISOString()]);
  }
};
