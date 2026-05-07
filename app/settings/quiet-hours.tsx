import { StyleSheet, Text, TextInput } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

export default function QuietHoursScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Quiet hours</Text>
      <TextInput style={styles.input} defaultValue="22:00" accessibilityLabel="Quiet hours start" />
      <TextInput style={styles.input} defaultValue="07:00" accessibilityLabel="Quiet hours end" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12 }
});
