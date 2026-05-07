import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export function useAppBootstrap() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true
      })
    });

    void Notifications.requestPermissionsAsync();
  }, []);
}
