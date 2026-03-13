import { Platform } from 'react-native';
import { FakeContact } from './types';

let Notifications: typeof import('expo-notifications') | null = null;

if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Notifications) return false;
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowSound: true,
      allowBadge: false,
      provideAppNotificationSettings: false,
    },
  });
  return status === 'granted';
}

export async function scheduleCallNotification(contact: FakeContact, delaySeconds: number): Promise<void> {
  if (!Notifications) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: contact.name,
      body: 'Incoming Call',
      data: { contactId: contact.id },
      sound: true,
      interruptionLevel: 'timeSensitive',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delaySeconds,
    },
  });
}

export async function cancelNotifications(): Promise<void> {
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
