import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useAppData } from '../../features/app/AppProvider';
import { followUpRepository } from '../../db/repositories/followUpRepository';
import { importantDateRepository } from '../../db/repositories/importantDateRepository';
import { noteRepository } from '../../db/repositories/noteRepository';
import { palette } from '../../theme/palette';
import { typography } from '../../theme/typography';
import { prettyDate } from '../../utils/date';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { people, addFollowUp, addImportantDate, addNote } = useAppData();
  const person = people.find((p) => p.id === id);
  const followUps = id ? followUpRepository.listByPerson(id) : [];
  const dates = id ? importantDateRepository.listByPerson(id) : [];
  const notes = id ? noteRepository.listByPerson(id) : [];
  const [noteText, setNoteText] = useState('');

  if (!person) {
    return <Screen><Text style={styles.subtitle}>Person not found.</Text></Screen>;
  }

  return (
    <Screen>
      <Text style={styles.title}>{person.name}</Text>
      <Text style={styles.subtitle}>{person.relationshipType}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Important dates</Text>
        {dates.map((d) => <Text key={d.id}>{d.title} • {prettyDate(d.date)}</Text>)}
        <Pressable style={styles.linkButton} onPress={() => addImportantDate(person.id, 'Custom moment', new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10))}>
          <Text style={styles.linkText}>+ Add date</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Follow-ups</Text>
        {followUps.map((f) => <Text key={f.id}>{f.title} • {prettyDate(f.dueAt)}</Text>)}
        <Pressable style={styles.linkButton} onPress={() => addFollowUp(person.id, `Check in with ${person.name}`, new Date(Date.now() + 86400000).toISOString())}>
          <Text style={styles.linkText}>+ Add follow-up</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        {notes.map((n) => <Text key={n.id}>{n.body}</Text>)}
        <TextInput placeholder="Add note" value={noteText} onChangeText={setNoteText} style={styles.input} />
        <Pressable
          style={styles.linkButton}
          onPress={() => {
            if (noteText.trim().length < 2) return;
            addNote(person.id, noteText.trim());
            setNoteText('');
          }}
        >
          <Text style={styles.linkText}>Save note</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  subtitle: { ...typography.body, color: palette.steel },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8 },
  sectionTitle: { ...typography.section, color: palette.charcoal, fontSize: 18 },
  linkButton: { paddingVertical: 8 },
  linkText: { color: palette.slateBlue, fontWeight: '600' },
  input: { borderWidth: StyleSheet.hairlineWidth, borderColor: palette.steel, borderRadius: 10, padding: 10 }
});
