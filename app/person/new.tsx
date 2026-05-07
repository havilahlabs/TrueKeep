import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useAppData } from '../../features/app/AppProvider';
import { RelationshipType } from '../../types/models';
import { palette } from '../../theme/palette';
import { typography } from '../../theme/typography';

export default function NewPersonScreen() {
  const { addPerson } = useAppData();
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('friend');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  return (
    <Screen>
      <Text style={styles.title}>Add person</Text>
      <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Relationship type (friend, parent...)" style={styles.input} value={relationshipType} onChangeText={(text) => setRelationshipType((text || 'friend') as RelationshipType)} />
      <TextInput placeholder="Nickname" style={styles.input} value={nickname} onChangeText={setNickname} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={styles.button}
        onPress={() => {
          const result = addPerson({ name: name.trim(), relationshipType, nickname: nickname.trim() || undefined });
          if (!result.ok) {
            setError(result.reason ?? 'Unable to add person');
            return;
          }
          router.back();
        }}
      >
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  button: { backgroundColor: palette.slateBlue, borderRadius: 12, padding: 14 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  error: { ...typography.caption, color: palette.warning }
});
