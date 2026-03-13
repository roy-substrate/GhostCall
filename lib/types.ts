export interface FakeContact {
  id: string;
  name: string;
  phoneNumber: string;
  voiceScript: string;
  avatarEmoji: string;
  isPreset: boolean;
}

export interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  date: string; // ISO string
  duration: number; // seconds
  wasAnswered: boolean;
}

export type CallState =
  | { status: 'idle' }
  | { status: 'waiting'; secondsRemaining: number; contact: FakeContact }
  | { status: 'ringing'; contact: FakeContact }
  | { status: 'active'; contact: FakeContact; seconds: number; isMuted: boolean; isSpeaker: boolean };

export type CallAction =
  | { type: 'SCHEDULE'; contact: FakeContact; delay: number }
  | { type: 'TICK' }
  | { type: 'START_RINGING' }
  | { type: 'ACCEPT' }
  | { type: 'DECLINE' }
  | { type: 'END' }
  | { type: 'CANCEL' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SPEAKER' }
  | { type: 'CALL_TICK' };

export const PRESET_CONTACTS: FakeContact[] = [
  {
    id: 'preset-mom',
    name: 'Mom',
    phoneNumber: '(555) 867-5309',
    voiceScript: "Hey sweetie, I just wanted to check in on you. Are you doing okay? I was thinking about you today. Can you call me back when you get a chance? Love you!",
    avatarEmoji: '👩',
    isPreset: true,
  },
  {
    id: 'preset-boss',
    name: 'Boss',
    phoneNumber: '(555) 234-5678',
    voiceScript: "Hey, sorry to bother you but something urgent came up at work. I need you to come in as soon as possible. Can you head over right now?",
    avatarEmoji: '👔',
    isPreset: true,
  },
  {
    id: 'preset-doctor',
    name: "Doctor's Office",
    phoneNumber: '(555) 912-3456',
    voiceScript: "Hi, this is calling from the doctor's office. We have an opening for your appointment today and we'd like to move it up. Can you come in within the next thirty minutes?",
    avatarEmoji: '🏥',
    isPreset: true,
  },
];
