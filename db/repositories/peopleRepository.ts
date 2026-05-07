import { getDb } from '../index';
import { Person } from '../../types/models';

export const peopleRepository = {
  list(): Person[] {
    return getDb().getAllSync<Person>('SELECT * FROM people WHERE archivedAt IS NULL ORDER BY updatedAt DESC');
  },
  getById(id: string): Person | null {
    return getDb().getFirstSync<Person>('SELECT * FROM people WHERE id = ?', [id]) ?? null;
  },
  create(person: Person) {
    getDb().runSync(
      `INSERT INTO people (id, name, relationshipType, nickname, birthday, anniversary, photoUri, accentColor, archivedAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [person.id, person.name, person.relationshipType, person.nickname ?? null, person.birthday ?? null, person.anniversary ?? null, person.photoUri ?? null, person.accentColor ?? null, person.archivedAt ?? null, person.createdAt, person.updatedAt]
    );
  },
  archive(id: string) {
    getDb().runSync('UPDATE people SET archivedAt = ?, updatedAt = ? WHERE id = ?', [new Date().toISOString(), new Date().toISOString(), id]);
  },
  remove(id: string) {
    getDb().runSync('DELETE FROM people WHERE id = ?', [id]);
  }
};
