import { getDb } from '../index';
import { Note } from '../../types/models';

export const noteRepository = {
  listByPerson(personId: string): Note[] {
    return getDb().getAllSync<Note>('SELECT * FROM notes WHERE personId = ? ORDER BY updatedAt DESC', [personId]);
  },
  search(query: string): Note[] {
    return getDb().getAllSync<Note>('SELECT * FROM notes WHERE body LIKE ? ORDER BY updatedAt DESC LIMIT 40', [`%${query}%`]);
  },
  create(row: Note) {
    getDb().runSync(
      `INSERT INTO notes (id, personId, body, tag, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [row.id, row.personId, row.body, row.tag ?? null, row.createdAt, row.updatedAt]
    );
  }
};
