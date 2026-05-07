import { getDb } from '../index';
import { ImportantDate } from '../../types/models';

export const importantDateRepository = {
  listByPerson(personId: string): ImportantDate[] {
    return getDb().getAllSync<ImportantDate>('SELECT * FROM important_dates WHERE personId = ? ORDER BY date ASC', [personId]);
  },
  listAll(): ImportantDate[] {
    return getDb().getAllSync<ImportantDate>('SELECT * FROM important_dates ORDER BY date ASC');
  },
  create(row: ImportantDate) {
    getDb().runSync(
      `INSERT INTO important_dates (id, personId, type, title, date, isRecurring, leadDays, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [row.id, row.personId, row.type, row.title, row.date, row.isRecurring, row.leadDays, row.notes ?? null, row.createdAt, row.updatedAt]
    );
  }
};
