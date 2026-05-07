import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { initializeDatabase } from '../db';
import { AppProvider } from '../features/app/AppProvider';
import { useAppBootstrap } from '../hooks/useAppBootstrap';

export default function RootLayout() {
  useAppBootstrap();

  useEffect(() => {
    void initializeDatabase();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ presentation: 'modal' }} />
        <Stack.Screen name="person/[id]" options={{ headerShown: true, title: 'Person' }} />
        <Stack.Screen name="person/edit/[id]" options={{ headerShown: true, title: 'Edit Person' }} />
        <Stack.Screen name="person/new" options={{ headerShown: true, title: 'Add Person' }} />
        <Stack.Screen name="purchase" options={{ presentation: 'modal', headerShown: true, title: 'Unlock Truekeep' }} />
        <Stack.Screen name="search" options={{ headerShown: true, title: 'Search' }} />
      </Stack>
    </AppProvider>
  );
}
