# Ghost Call

Fake incoming call app to escape awkward social situations. Schedule a realistic fake call from a preset or custom contact, complete with ringtone, haptics, and text-to-speech voice scripts.

## Features

- **Realistic Call UI** — Incoming and active call screens that mimic native iOS
- **3 Preset Contacts** — Mom, Boss, Doctor's Office ready to go
- **Custom Contacts** — Create unlimited contacts with Pro (name, phone, avatar, voice script)
- **Quick Escape** — One-tap 5-second countdown for instant fake calls
- **Schedule Calls** — Pick a delay (5s, 15s, 30s, or custom with Pro)
- **Voice Scripts** — Text-to-speech plays through earpiece when you answer
- **Haptic Feedback** — Vibration pattern during ringing
- **Background Notifications** — Calls trigger even when app is backgrounded
- **Call History** — Track all your ghost calls
- **Freemium Model** — Free tier with 3 presets, Pro unlocks everything

## Tech Stack

- **Expo** (SDK 55) with React Native
- **TypeScript**
- **Expo Router** (file-based navigation)
- **React Context + useReducer** (call state machine)
- **expo-notifications** — local push notifications
- **expo-av** — ringtone playback
- **expo-speech** — TTS voice scripts
- **expo-haptics** — vibration feedback
- **AsyncStorage** — on-device persistence

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Run on iOS simulator
npm run ios

# Run on web
npm run web
```

## Call State Machine

```
idle → waiting(secondsRemaining) → ringing → active → idle
```

- **idle** — Home screen, ready to schedule
- **waiting** — Countdown active, cancelable
- **ringing** — Fullscreen incoming call UI, ringtone + haptics
- **active** — Call accepted, timer running, TTS voice playing
- **idle** — Call ended, record saved to history

## Project Structure

```
GhostCall/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigation (Home, Contacts, History, Settings)
│   ├── incoming-call.tsx   # Fullscreen incoming call modal
│   └── active-call.tsx     # Fullscreen active call modal
├── components/             # Reusable UI components
├── context/                # CallContext (state machine + provider)
├── lib/                    # Types, storage, audio, haptics, speech, notifications
└── assets/                 # Ringtone audio file
```

## Freemium Tiers

| Feature | Free | Pro ($2.99/mo) |
|---------|------|----------------|
| Preset contacts | 3 | 3 |
| Custom contacts | — | Unlimited |
| Delay options | 5s, 15s, 30s | All + custom |
| Ringtone | Default | Custom |
| Voice scripts | System TTS | System TTS |
