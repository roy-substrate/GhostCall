import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CallProvider, useCall } from '../context/CallContext';
import { useRouter } from 'expo-router';
import { requestNotificationPermissions } from '../lib/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_KEY } from './onboarding';

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const { state } = useCall();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      if (!val) {
        router.replace('/onboarding');
      }
      setOnboardingChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!onboardingChecked) return;
    if (state.status === 'ringing') {
      router.push('/incoming-call');
    }
  }, [state.status, onboardingChecked]);

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
            contentStyle: { backgroundColor: '#0a0a0f' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="onboarding"
            options={{ animation: 'fade', gestureEnabled: false }}
          />
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
