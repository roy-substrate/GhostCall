import { Platform } from 'react-native';

let Haptics: typeof import('expo-haptics') | null = null;
if (Platform.OS !== 'web') {
  Haptics = require('expo-haptics');
}

let hapticInterval: ReturnType<typeof setInterval> | null = null;

export function triggerRingingHaptic(): void {
  if (!Haptics) return;
  hapticInterval = setInterval(() => {
    Haptics!.notificationAsync(Haptics!.NotificationFeedbackType.Warning);
  }, 1500);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function stopHaptic(): void {
  if (hapticInterval) {
    clearInterval(hapticInterval);
    hapticInterval = null;
  }
}
