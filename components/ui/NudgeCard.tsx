import { Pressable, StyleSheet, Text, View } from 'react-native';
import { typography } from '../../theme/typography';
import { palette } from '../../theme/palette';

export type NudgeCardProps = {
  title: string;
  supportingText: string;
  whyNow: string;
  onDone?: () => void;
  onSnooze?: () => void;
};

export function NudgeCard({ title, supportingText, whyNow, onDone, onSnooze }: NudgeCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{supportingText}</Text>
      <Text style={styles.caption}>{whyNow}</Text>
      <View style={styles.row}>
        <Pressable onPress={onDone} style={styles.primary}><Text style={styles.buttonText}>Mark done</Text></Pressable>
        <Pressable onPress={onSnooze} style={styles.secondary}><Text style={styles.secondaryText}>Snooze</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, elevation: 1 },
  title: { ...typography.section, color: palette.ink },
  body: { ...typography.body, color: palette.charcoal },
  caption: { ...typography.caption, color: palette.steel },
  row: { flexDirection: 'row', gap: 12 },
  primary: { backgroundColor: palette.slateBlue, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  secondary: { backgroundColor: palette.stone, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600' },
  secondaryText: { color: palette.ink, fontWeight: '600' }
});
