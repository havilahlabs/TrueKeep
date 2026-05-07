import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';

import { followUpRepository } from '../../db/repositories/followUpRepository';
import { importantDateRepository } from '../../db/repositories/importantDateRepository';
import { noteRepository } from '../../db/repositories/noteRepository';
import { nudgeRepository } from '../../db/repositories/nudgeRepository';
import { peopleRepository } from '../../db/repositories/peopleRepository';
import { settingsRepository } from '../../db/repositories/settingsRepository';
import { generateNudges } from '../../services/nudgeGeneration';
import { getTodaysTopNudge } from '../../services/nudgeEngine';
import { syncWidgetPayload } from '../../services/widgetAdapter';
import { listenToPurchaseUpdates, restorePurchases, teardownIAP } from '../../services/purchaseService';
import { AppSettings, FollowUp, ImportantDate, Note, Nudge, Person, PurchaseState, RelationshipType } from '../../types/models';
import { createId } from '../../utils/id';

type AppContextValue = {
  people: Person[];
  nudges: Nudge[];
  settings: AppSettings | null;
  purchase: PurchaseState | null;
  searchNotes: (query: string) => Note[];
  refresh: () => void;
  addPerson: (input: { name: string; relationshipType: RelationshipType; nickname?: string }) => { ok: boolean; reason?: string };
  addFollowUp: (personId: string, title: string, dueAt: string, context?: string) => void;
  addImportantDate: (personId: string, title: string, date: string, type?: string) => void;
  addNote: (personId: string, body: string, tag?: string) => void;
  unlock: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [people, setPeople] = useState<Person[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [purchase, setPurchase] = useState<PurchaseState | null>(null);

  const refresh = () => {
    const nextPeople = peopleRepository.list();
    const openFollowUps = followUpRepository.listOpen();
    const importantDates = importantDateRepository.listAll();
    const generated = generateNudges(nextPeople, openFollowUps, importantDates);

    generated.forEach((nudge) => nudgeRepository.upsert(nudge));
    const activeNudges = nudgeRepository.listActive();
    setPeople(nextPeople);
    setNudges(activeNudges);
    setSettings(settingsRepository.getSettings());
    setPurchase(settingsRepository.getPurchaseState());
    syncWidgetPayload(activeNudges);
  };

  useEffect(() => {
    refresh();

    // Listen for successful IAP purchases and automatically unlock
    const unlockFromPurchase = async () => {
      settingsRepository.unlock();
      refresh();
    };

    const removePurchaseListeners = listenToPurchaseUpdates(
      async () => { await unlockFromPurchase(); },
      () => undefined,
    );

    // Restore any previously completed purchases on launch
    restorePurchases(async () => { await unlockFromPurchase(); }).catch(() => undefined);

    return () => {
      removePurchaseListeners();
      teardownIAP().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const top = getTodaysTopNudge(nudges);
    if (!top) return;
    Notifications.scheduleNotificationAsync({
      content: { title: top.title, body: top.supportingText },
      trigger: null
    }).catch(() => undefined);
  }, [nudges]);

  const value = useMemo<AppContextValue>(() => ({
    people,
    nudges,
    settings,
    purchase,
    searchNotes: (query: string) => noteRepository.search(query),
    refresh,
    addPerson: ({ name, relationshipType, nickname }) => {
      const unlocked = settingsRepository.getPurchaseState().unlocked === 1;
      const limits = settingsRepository.getSettings();
      const currentCount = peopleRepository.list().length;
      if (!unlocked && currentCount >= limits.freeTierPeopleLimit) {
        return { ok: false, reason: 'Free plan allows up to 3 people. Unlock to add more.' };
      }
      const now = new Date().toISOString();
      peopleRepository.create({
        id: createId('person'),
        name,
        relationshipType,
        nickname: nickname || null,
        birthday: null,
        anniversary: null,
        photoUri: null,
        accentColor: null,
        archivedAt: null,
        createdAt: now,
        updatedAt: now
      });
      refresh();
      return { ok: true };
    },
    addFollowUp: (personId, title, dueAt, context) => {
      const now = new Date().toISOString();
      const row: FollowUp = { id: createId('follow'), personId, title, dueAt, context: context ?? null, status: 'open', snoozedUntil: null, createdAt: now, updatedAt: now };
      followUpRepository.create(row);
      refresh();
    },
    addImportantDate: (personId, title, date, type = 'custom') => {
      const now = new Date().toISOString();
      const row: ImportantDate = {
        id: createId('date'),
        personId,
        type,
        title,
        date,
        isRecurring: 1,
        leadDays: type === 'birthday' || type === 'anniversary' ? 7 : 1,
        notes: null,
        createdAt: now,
        updatedAt: now
      };
      importantDateRepository.create(row);
      refresh();
    },
    addNote: (personId, body, tag) => {
      const now = new Date().toISOString();
      const row: Note = { id: createId('note'), personId, body, tag: tag ?? null, createdAt: now, updatedAt: now };
      noteRepository.create(row);
      refresh();
    },
    unlock: () => {
      settingsRepository.unlock();
      refresh();
    }
  }), [people, nudges, settings, purchase]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used inside AppProvider');
  return ctx;
}
