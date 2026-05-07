import { StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

export default function ReminderSettingsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Reminder preferences</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Enable local notifications</Text>
        <Switch value />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...typography.body, color: palette.charcoal }
});
