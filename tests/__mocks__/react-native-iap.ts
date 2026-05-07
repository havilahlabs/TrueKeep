export const initConnection = async () => true;
export const endConnection = async () => undefined;
export const getProducts = async () => [];
export const requestPurchase = async () => undefined;
export const finishTransaction = async () => undefined;
export const getAvailablePurchases = async () => [];
export const purchaseUpdatedListener = () => ({ remove: () => undefined });
export const purchaseErrorListener = () => ({ remove: () => undefined });
