import { FollowUp, ImportantDate, Nudge, Person } from '../types/models';
import { createId } from '../utils/id';
import { staleConnectionDays } from './nudgeEngine';

function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function generateNudges(people: Person[], followUps: FollowUp[], dates: ImportantDate[]): Nudge[] {
  const createdAt = new Date().toISOString();
  const nudges: Nudge[] = [];

  for (const f of followUps) {
    nudges.push({
      id: createId('n_follow'),
      personId: f.personId,
      sourceType: 'follow_up',
      sourceId: f.id,
      title: f.title,
      supportingText: f.context ?? 'Follow up from a recent conversation.',
      whyNow: new Date(f.dueAt) <= new Date() ? 'Overdue follow-up' : 'Due soon',
      score: new Date(f.dueAt) <= new Date() ? 90 : 70,
      state: 'pending',
      scheduledFor: f.dueAt,
      createdAt,
      updatedAt: createdAt
    });
  }

  for (const d of dates) {
    const lead = d.leadDays || (d.type === 'birthday' || d.type === 'anniversary' ? 7 : 1);
    const eventDate = new Date(d.date);
    const schedule = new Date(eventDate.getTime() - lead * 86400000);
    const until = daysUntil(schedule.toISOString());
    if (until <= 30) {
      nudges.push({
        id: createId('n_date'),
        personId: d.personId,
        sourceType: 'important_date',
        sourceId: d.id,
        title: `${d.title} is coming up`,
        supportingText: d.notes ?? 'Good moment for a thoughtful check-in.',
        whyNow: until <= 0 ? 'Today' : `${until} day${until === 1 ? '' : 's'} away`,
        score: until <= 0 ? 95 : 65,
        state: 'pending',
        scheduledFor: schedule.toISOString(),
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  for (const p of people) {
    const threshold = staleConnectionDays(p.relationshipType);
    const daysSinceUpdate = Math.ceil((Date.now() - new Date(p.updatedAt).getTime()) / 86400000);
    if (daysSinceUpdate >= threshold) {
      nudges.push({
        id: createId('n_stale'),
        personId: p.id,
        sourceType: 'stale_connection',
        sourceId: p.id,
        title: `Check in with ${p.name}`,
        supportingText: 'A short note can go a long way.',
        whyNow: `It has been ${daysSinceUpdate} days`,
        score: 55,
        state: 'pending',
        scheduledFor: new Date().toISOString(),
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  return nudges;
}
