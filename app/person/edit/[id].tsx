import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Screen } from '../../../components/ui/Screen';
import { typography } from '../../../theme/typography';
import { palette } from '../../../theme/palette';

export default function EditPersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <Text style={styles.title}>Edit person</Text>
      <Text style={styles.caption}>ID: {id}</Text>
      <TextInput style={styles.input} defaultValue="Maya Chen" />
      <Pressable style={styles.button} onPress={() => router.back()}><Text style={styles.buttonText}>Update</Text></Pressable>
      <Pressable><Text style={styles.delete}>Archive person</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  caption: { ...typography.caption, color: palette.steel },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  button: { backgroundColor: palette.slateBlue, borderRadius: 12, padding: 14 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  delete: { textAlign: 'center', color: palette.warning }
});
