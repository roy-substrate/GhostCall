import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CallProvider, useCall } from '../context/CallContext';
import { useRouter } from 'expo-router';
import { requestNotificationPermissions } from '../lib/notifications';

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const { state } = useCall();
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'ringing') {
      router.push('/incoming-call');
    }
  }, [state.status]);

  return <>{children}</>;
}

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <CallProvider>
      <StatusBar style="light" />
      <NavigationHandler>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="incoming-call"
            options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
          />
          <Stack.Screen
            name="active-call"
            options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
          />
        </Stack>
      </NavigationHandler>
    </CallProvider>
  );
}
