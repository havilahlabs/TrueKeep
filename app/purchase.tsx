import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/ui/Screen';
import { useAppData } from '../features/app/AppProvider';
import {
  getUnlockProduct,
  purchaseUnlock,
  restorePurchases,
  type UnlockProduct,
} from '../services/purchaseService';
import { settingsRepository } from '../db/repositories/settingsRepository';
import { palette } from '../theme/palette';
import { typography } from '../theme/typography';

export default function PurchaseScreen() {
  const { purchase, refresh } = useAppData();
  const unlocked = purchase?.unlocked === 1;

  const [product, setProduct] = useState<UnlockProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    getUnlockProduct()
      .then(setProduct)
      .catch(() => setProduct(null));
  }, []);

  const handlePurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      await purchaseUnlock();
      // purchaseUpdatedListener in AppProvider will call refresh() on success
    } catch {
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setError(null);
    setRestoring(true);
    try {
      let found = false;
      await restorePurchases(async () => {
        found = true;
        settingsRepository.unlock();
        refresh();
      });
      if (!found) setError('No previous purchase found.');
    } catch {
      setError('Restore failed. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  const priceLabel = product?.displayPrice ?? '—';

  return (
    <Screen>
      <Text style={styles.title}>Unlock Truekeep</Text>
      <Text style={styles.body}>One-time purchase. No subscription.</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Free</Text>
        <Text style={styles.cardBody}>Up to 3 people, basic reminders, default widget.</Text>
      </View>

      <View style={[styles.card, styles.cardHighlight]}>
        <Text style={styles.subtitle}>Unlocked — {priceLabel}</Text>
        <Text style={styles.cardBody}>
          Unlimited people, full widgets, privacy lock, history and export.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, (unlocked || loading) && styles.buttonDisabled]}
        onPress={handlePurchase}
        disabled={unlocked || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {unlocked ? 'Already unlocked' : `Unlock once — ${priceLabel}`}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={handleRestore} disabled={restoring}>
        <Text style={styles.link}>{restoring ? 'Restoring…' : 'Restore purchase'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: palette.ink },
  body: { ...typography.body, color: palette.steel },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 4 },
  cardHighlight: { borderWidth: 2, borderColor: palette.mutedPlum },
  cardBody: { ...typography.body, color: palette.charcoal },
  subtitle: { ...typography.section, color: palette.charcoal, fontSize: 18 },
  button: { backgroundColor: palette.mutedPlum, borderRadius: 12, padding: 14 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  link: { textAlign: 'center', color: palette.slateBlue },
  error: { color: '#c0392b', textAlign: 'center', fontSize: 14 },
});
