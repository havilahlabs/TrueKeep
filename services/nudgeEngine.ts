import { Nudge, RelationshipType } from '../types/models';

const staleDaysByRelationship: Record<RelationshipType, number> = {
  partner: 5,
  parent: 10,
  sibling: 14,
  friend: 14,
  mentor: 21,
  child: 5,
  other: 14
};

export function scoreNudge(nudge: Nudge, now: Date = new Date()): number {
  let score = nudge.score;
  const scheduled = new Date(nudge.scheduledFor);
  const daysDiff = Math.ceil((scheduled.getTime() - now.getTime()) / 86400000);

  if (daysDiff <= 0) score += 60;
  if (nudge.sourceType === 'follow_up') score += 25;
  if (nudge.sourceType === 'important_date' && daysDiff <= 7) score += 30;
  if (nudge.snoozedUntil) score -= 20;
  if (nudge.state === 'completed') score -= 80;

  return score;
}

export function getTodaysTopNudge(nudges: Nudge[]): Nudge | null {
  const pending = nudges.filter((n) => n.state === 'pending' || n.state === 'snoozed');
  if (!pending.length) return null;
  return [...pending].sort((a, b) => scoreNudge(b) - scoreNudge(a))[0] ?? null;
}

export function getUpcomingNudges(nudges: Nudge[]): Nudge[] {
  return nudges
    .filter((n) => n.state !== 'completed')
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
    .slice(0, 8);
}

export function staleConnectionDays(type: RelationshipType): number {
  return staleDaysByRelationship[type];
}

export function snoozeNudge(nudge: Nudge, hours = 24): Nudge {
  const snoozeDate = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  return { ...nudge, state: 'snoozed', snoozedUntil: snoozeDate, updatedAt: new Date().toISOString() };
}

export function completeNudge(nudge: Nudge): Nudge {
  const stamp = new Date().toISOString();
  return { ...nudge, state: 'completed', completedAt: stamp, updatedAt: stamp };
}
