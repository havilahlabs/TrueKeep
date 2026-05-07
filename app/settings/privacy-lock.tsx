import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen } from '../../components/ui/Screen';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

export default function PrivacyLockScreen() {
  const [status, setStatus] = useState('Not enabled');

  const enable = async () => {
    const auth = await LocalAuthentication.authenticateAsync({ promptMessage: 'Enable privacy lock' });
    setStatus(auth.success ? 'Enabled' : 'Not enabled');
  };

  return (
    <Screen>
      <Text style={styles.title}>Privacy lock</Text>
      <Text style={styles.status}>{status}</Text>
      <Pressable style={styles.button} onPress={enable}><Text style={styles.buttonText}>Enable lock</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  status: { ...typography.body, color: palette.steel },
  button: { backgroundColor: palette.charcoal, borderRadius: 12, padding: 14 },
  buttonText: { color: '#fff', textAlign: 'center' }
});
