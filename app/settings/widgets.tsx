import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

export default function WidgetsSettingsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Widget setup</Text>
      <Text style={styles.body}>Small widget: top nudge.</Text>
      <Text style={styles.body}>Medium widget: top nudge + why now.</Text>
      <Text style={styles.caption}>Platform-specific quick actions are documented in docs/widgets.md.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  body: { ...typography.body, color: palette.charcoal },
  caption: { ...typography.caption, color: palette.steel }
});
