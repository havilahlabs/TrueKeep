import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Screen } from '../components/ui/Screen';
import { palette } from '../theme/palette';
import { typography } from '../theme/typography';

export default function OnboardingScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Remember the little things.</Text>
      <Text style={styles.body}>Truekeep is private and local-first. Add people you care about, capture details, and get timely prompts.</Text>
      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  body: { ...typography.body, color: palette.charcoal },
  button: { backgroundColor: palette.slateBlue, borderRadius: 12, padding: 14, marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' }
});
