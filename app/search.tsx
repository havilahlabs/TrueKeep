import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../components/ui/Screen';
import { useAppData } from '../features/app/AppProvider';
import { palette } from '../theme/palette';
import { typography } from '../theme/typography';

export default function SearchScreen() {
  const { searchNotes } = useAppData();
  const [query, setQuery] = useState('');
  const results = useMemo(() => (query.trim().length > 1 ? searchNotes(query.trim()) : []), [query, searchNotes]);

  return (
    <Screen>
      <Text style={styles.title}>Search</Text>
      <TextInput accessibilityLabel="Search people and notes" placeholder="Search notes" style={styles.input} value={query} onChangeText={setQuery} />
      <View style={styles.empty}>
        {results.length === 0 ? <Text style={styles.caption}>Search stays on device.</Text> : results.map((r) => <Text key={r.id}>{r.body}</Text>)}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  empty: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 8 },
  caption: { ...typography.body, color: palette.steel }
});
