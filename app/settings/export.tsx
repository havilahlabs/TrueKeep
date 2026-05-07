import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { exportData } from '../../services/exportService';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

export default function ExportScreen() {
  const [result, setResult] = useState('No export generated yet.');

  return (
    <Screen>
      <Text style={styles.title}>Export backup</Text>
      <Text style={styles.body}>{result}</Text>
      <Pressable
        style={styles.button}
        onPress={async () => {
          const uri = await exportData();
          setResult(`Backup written to ${uri}`);
        }}
      >
        <Text style={styles.buttonText}>Create local backup</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  body: { ...typography.body, color: palette.steel },
  button: { backgroundColor: palette.mutedSage, borderRadius: 12, padding: 14 },
  buttonText: { color: '#fff', textAlign: 'center' }
});
