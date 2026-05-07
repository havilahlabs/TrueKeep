import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useAppData } from '../../features/app/AppProvider';
import { getUpcomingNudges } from '../../services/nudgeEngine';
import { palette } from '../../theme/palette';
import { typography } from '../../theme/typography';
import { prettyDate } from '../../utils/date';

export default function RemindersScreen() {
  const { nudges } = useAppData();
  const upcoming = getUpcomingNudges(nudges);

  return (
    <Screen>
      <Text style={styles.title}>Reminders</Text>
      <Text style={styles.subtitle}>Worth checking in.</Text>
      {upcoming.length === 0 ? <Text style={styles.subtitle}>No reminders yet.</Text> : null}
      {upcoming.map((nudge) => (
        <View style={styles.item} key={nudge.id}>
          <Text style={styles.itemTitle}>{nudge.title}</Text>
          <Text style={styles.meta}>
            {nudge.whyNow} • {prettyDate(nudge.scheduledFor)}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  subtitle: { ...typography.body, color: palette.steel },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 4 },
  itemTitle: { ...typography.body, color: palette.charcoal },
  meta: { ...typography.caption, color: palette.steel }
});
