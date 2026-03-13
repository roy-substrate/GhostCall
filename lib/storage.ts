import AsyncStorage from '@react-native-async-storage/async-storage';
import { FakeContact, CallRecord, PRESET_CONTACTS } from './types';

const CONTACTS_KEY = 'ghostcall_contacts';
const HISTORY_KEY = 'ghostcall_history';
const SETTINGS_KEY = 'ghostcall_settings';

export interface AppSettings {
  vibrate: boolean;
  autoAnswer: boolean;
  isPro: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  vibrate: true,
  autoAnswer: false,
  isPro: false,
};

export async function loadContacts(): Promise<FakeContact[]> {
  try {
    const raw = await AsyncStorage.getItem(CONTACTS_KEY);
    if (raw) {
      const custom: FakeContact[] = JSON.parse(raw);
      return [...PRESET_CONTACTS, ...custom];
    }
  } catch {}
  return [...PRESET_CONTACTS];
}

export async function saveCustomContacts(contacts: FakeContact[]): Promise<void> {
  const custom = contacts.filter((c) => !c.isPreset);
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(custom));
}

export async function loadHistory(): Promise<CallRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export async function saveHistory(records: CallRecord[]): Promise<void> {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
