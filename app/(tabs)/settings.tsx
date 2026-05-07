import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

const rows = [
  { label: 'Reminder preferences', href: '/settings/reminders' },
  { label: 'Quiet hours', href: '/settings/quiet-hours' },
  { label: 'Widget setup', href: '/settings/widgets' },
  { label: 'Privacy lock', href: '/settings/privacy-lock' },
  { label: 'Export data', href: '/settings/export' },
  { label: 'Unlock Truekeep', href: '/purchase' }
];

export default function SettingsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        {rows.map((row) => (
          <Link key={row.label} href={row.href as never} style={styles.link}>{row.label}</Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  section: { backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 12 },
  link: { ...typography.body, color: palette.charcoal }
});
