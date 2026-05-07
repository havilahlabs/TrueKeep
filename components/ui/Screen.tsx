import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../../theme/palette';

type ScreenProps = PropsWithChildren<{ scroll?: boolean }>;

export function Screen({ children, scroll = true }: ScreenProps) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <Wrapper contentContainerStyle={styles.content}>{children}</Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.surface },
  content: { padding: 16, gap: 16 }
});
