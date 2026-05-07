import { describe, expect, it } from 'vitest';
import { completeNudge, getTodaysTopNudge, scoreNudge, staleConnectionDays } from '../services/nudgeEngine';
import { Nudge } from '../types/models';

const base: Nudge = {
  id: 'n1',
  personId: 'p1',
  sourceType: 'follow_up',
  sourceId: 'f1',
  title: 'Follow up',
  supportingText: 'text',
  whyNow: 'Due',
  score: 10,
  state: 'pending',
  scheduledFor: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('nudgeEngine', () => {
  it('ranks due follow-up above future date', () => {
    const due = { ...base, id: 'due', score: 20 };
    const future = { ...base, id: 'future', sourceType: 'important_date' as const, scheduledFor: new Date(Date.now() + 5 * 86400000).toISOString(), score: 20 };
    const top = getTodaysTopNudge([future, due]);
    expect(top?.id).toBe('due');
  });

  it('scores snoozed lower', () => {
    const normal = scoreNudge(base);
    const snoozed = scoreNudge({ ...base, snoozedUntil: new Date().toISOString() });
    expect(normal).toBeGreaterThan(snoozed);
  });

  it('completes nudges', () => {
    const completed = completeNudge(base);
    expect(completed.state).toBe('completed');
    expect(completed.completedAt).toBeTruthy();
  });

  it('uses stale thresholds', () => {
    expect(staleConnectionDays('partner')).toBe(5);
    expect(staleConnectionDays('mentor')).toBe(21);
  });
});
