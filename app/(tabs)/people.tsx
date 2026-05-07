import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useAppData } from '../../features/app/AppProvider';
import { palette } from '../../theme/palette';
import { typography } from '../../theme/typography';

export default function PeopleScreen() {
  const { people } = useAppData();
  const grouped = useMemo(
    () =>
      people.reduce<Record<string, typeof people>>((acc, person) => {
        (acc[person.relationshipType] ||= []).push(person);
        return acc;
      }, {}),
    [people]
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>People</Text>
        <Link href="/person/new">Add</Link>
      </View>
      {people.length === 0 ? <Text style={styles.empty}>No people yet. Add someone you care about.</Text> : null}
      {Object.entries(grouped).map(([group, rows]) => (
        <View key={group} style={styles.section}>
          <Text style={styles.group}>{group}</Text>
          {rows.map((person) => (
            <Link href={`/person/${person.id}` as never} asChild key={person.id}>
              <Pressable style={styles.row}>
                <Text style={styles.name}>{person.name}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...typography.title, color: palette.ink },
  empty: { ...typography.body, color: palette.steel },
  section: { backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 8 },
  group: { ...typography.caption, textTransform: 'capitalize', color: palette.steel },
  row: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.stone },
  name: { ...typography.body, color: palette.charcoal }
});
