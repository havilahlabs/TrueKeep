import { describe, expect, it } from 'vitest';
import { generateNudges } from '../services/nudgeGeneration';
import { FollowUp, ImportantDate, Person } from '../types/models';

const now = new Date().toISOString();

describe('nudgeGeneration', () => {
  it('creates follow-up and date nudges', () => {
    const people: Person[] = [
      {
        id: 'p1',
        name: 'Maya',
        relationshipType: 'friend',
        createdAt: now,
        updatedAt: now
      }
    ];

    const followUps: FollowUp[] = [
      { id: 'f1', personId: 'p1', title: 'Text Maya', dueAt: now, status: 'open', createdAt: now, updatedAt: now }
    ];

    const dates: ImportantDate[] = [
      { id: 'd1', personId: 'p1', type: 'birthday', title: 'Birthday', date: new Date(Date.now() + 8 * 86400000).toISOString(), isRecurring: 1, leadDays: 7, createdAt: now, updatedAt: now }
    ];

    const nudges = generateNudges(people, followUps, dates);
    expect(nudges.some((n) => n.sourceType === 'follow_up')).toBe(true);
    expect(nudges.some((n) => n.sourceType === 'important_date')).toBe(true);
  });
});
