import {
  endConnection,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type Purchase,
  type PurchaseError,
} from 'react-native-iap';

export const UNLOCK_PRODUCT_ID = 'com.truekeep.app.unlock';

let initialized = false;

export async function initIAP(): Promise<void> {
  if (initialized) return;
  await initConnection();
  initialized = true;
}

export async function teardownIAP(): Promise<void> {
  if (!initialized) return;
  await endConnection();
  initialized = false;
}

export type UnlockProduct = {
  id: string;
  title: string;
  description: string;
  displayPrice: string;
};

export async function getUnlockProduct(): Promise<UnlockProduct | null> {
  await initIAP();
  const products = await fetchProducts({ skus: [UNLOCK_PRODUCT_ID] });
  if (!products) return null;
  const product = products[0];
  if (!product) return null;
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    displayPrice: product.displayPrice,
  };
}

export function listenToPurchaseUpdates(
  onSuccess: (purchase: Purchase) => Promise<void>,
  onError: (error: PurchaseError) => void,
): () => void {
  const successSub = purchaseUpdatedListener(async (purchase) => {
    const hasReceipt =
      ('purchaseToken' in purchase && !!purchase.purchaseToken) ||
      ('transactionId' in purchase && !!purchase.transactionId);

    if (hasReceipt) {
      await onSuccess(purchase);
      await finishTransaction({ purchase, isConsumable: false });
    }
  });

  const errorSub = purchaseErrorListener((error) => onError(error));

  return () => {
    successSub.remove();
    errorSub.remove();
  };
}

export async function purchaseUnlock(): Promise<void> {
  await initIAP();
  await requestPurchase({
    request: {
      apple: { sku: UNLOCK_PRODUCT_ID },
      google: { skus: [UNLOCK_PRODUCT_ID] },
    },
    type: 'in-app',
  });
}

export async function restorePurchases(
  onRestored: (purchase: Purchase) => Promise<void>,
): Promise<void> {
  await initIAP();
  const purchases = await getAvailablePurchases();
  for (const purchase of purchases) {
    if (purchase.productId === UNLOCK_PRODUCT_ID) {
      await onRestored(purchase);
    }
  }
}
