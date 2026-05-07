import { getDb } from '../index';
import { Nudge } from '../../types/models';

export const nudgeRepository = {
  listActive(): Nudge[] {
    return getDb().getAllSync<Nudge>("SELECT * FROM nudges WHERE state IN ('pending','snoozed') ORDER BY scheduledFor ASC");
  },
  listHistory(limit = 30): Nudge[] {
    return getDb().getAllSync<Nudge>('SELECT * FROM nudges ORDER BY updatedAt DESC LIMIT ?', [limit]);
  },
  upsert(nudge: Nudge) {
    getDb().runSync(
      `INSERT OR REPLACE INTO nudges (id, personId, sourceType, sourceId, title, supportingText, whyNow, score, state, scheduledFor, snoozedUntil, completedAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nudge.id,
        nudge.personId ?? null,
        nudge.sourceType,
        nudge.sourceId ?? null,
        nudge.title,
        nudge.supportingText,
        nudge.whyNow,
        nudge.score,
        nudge.state,
        nudge.scheduledFor,
        nudge.snoozedUntil ?? null,
        nudge.completedAt ?? null,
        nudge.createdAt,
        nudge.updatedAt
      ]
    );
  },
  removeBySource(sourceType: Nudge['sourceType'], sourceId: string) {
    getDb().runSync('DELETE FROM nudges WHERE sourceType = ? AND sourceId = ?', [sourceType, sourceId]);
  }
};
