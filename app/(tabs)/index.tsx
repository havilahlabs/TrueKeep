import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { NudgeCard } from '../../components/ui/NudgeCard';
import { Screen } from '../../components/ui/Screen';
import { useAppData } from '../../features/app/AppProvider';
import { getTodaysTopNudge, getUpcomingNudges } from '../../services/nudgeEngine';
import { palette } from '../../theme/palette';
import { typography } from '../../theme/typography';
import { prettyDate } from '../../utils/date';

export default function HomeScreen() {
  const { nudges } = useAppData();
  const top = getTodaysTopNudge(nudges);
  const upcoming = getUpcomingNudges(nudges);

  return (
    <Screen>
      <View>
        <Text style={styles.title}>Today&apos;s Nudge</Text>
        <Text style={styles.subtitle}>One thoughtful thing at a time.</Text>
      </View>

      {top ? (
        <NudgeCard title={top.title} supportingText={top.supportingText} whyNow={top.whyNow} />
      ) : (
        <View style={styles.empty}><Text style={styles.emptyText}>Saved so you don&apos;t have to remember it all. Add your first person.</Text></View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming nudges</Text>
        {upcoming.length === 0 ? <Text style={styles.rowDate}>No pending nudges yet.</Text> : null}
        {upcoming.map((nudge) => (
          <View key={nudge.id} style={styles.row}>
            <Text style={styles.rowTitle}>{nudge.title}</Text>
            <Text style={styles.rowDate}>{prettyDate(nudge.scheduledFor)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <Link href="/person/new">+ Add person</Link>
        <Link href="/search">Search notes</Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  subtitle: { ...typography.body, color: palette.steel, marginTop: 4 },
  empty: { backgroundColor: '#fff', borderRadius: 14, padding: 14 },
  emptyText: { ...typography.body, color: palette.steel },
  section: { backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 12 },
  sectionTitle: { ...typography.section, color: palette.ink },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rowTitle: { ...typography.body, flex: 1, color: palette.charcoal },
  rowDate: { ...typography.caption, color: palette.steel }
});
