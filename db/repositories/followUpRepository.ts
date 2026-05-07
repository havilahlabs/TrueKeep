import { getDb } from '../index';
import { FollowUp } from '../../types/models';

export const followUpRepository = {
  listByPerson(personId: string): FollowUp[] {
    return getDb().getAllSync<FollowUp>('SELECT * FROM follow_ups WHERE personId = ? ORDER BY dueAt ASC', [personId]);
  },
  listOpen(): FollowUp[] {
    return getDb().getAllSync<FollowUp>("SELECT * FROM follow_ups WHERE status = 'open' ORDER BY dueAt ASC");
  },
  create(row: FollowUp) {
    getDb().runSync(
      `INSERT INTO follow_ups (id, personId, title, context, dueAt, status, snoozedUntil, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [row.id, row.personId, row.title, row.context ?? null, row.dueAt, row.status, row.snoozedUntil ?? null, row.createdAt, row.updatedAt]
    );
  }
};
