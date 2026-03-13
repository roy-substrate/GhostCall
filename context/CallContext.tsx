import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { CallState, CallAction, FakeContact, CallRecord } from '../lib/types';
import { loadContacts, saveCustomContacts, loadHistory, saveHistory, loadSettings, saveSettings, AppSettings } from '../lib/storage';
import { playRingtone, stopRingtone } from '../lib/audioManager';
import { triggerRingingHaptic, stopHaptic } from '../lib/haptics';
import { speakScript, stopSpeaking } from '../lib/speechManager';
import { scheduleCallNotification, cancelNotifications } from '../lib/notifications';

function callReducer(state: CallState, action: CallAction): CallState {
  switch (action.type) {
    case 'SCHEDULE':
      return { status: 'waiting', secondsRemaining: action.delay, contact: action.contact };
    case 'TICK':
      if (state.status === 'waiting') {
        const next = state.secondsRemaining - 1;
        if (next <= 0) return { status: 'ringing', contact: state.contact };
        return { ...state, secondsRemaining: next };
      }
      return state;
    case 'START_RINGING':
      if (state.status === 'waiting') return { status: 'ringing', contact: state.contact };
      return state;
    case 'ACCEPT':
      if (state.status === 'ringing') return { status: 'active', contact: state.contact, seconds: 0, isMuted: false, isSpeaker: false };
      return state;
    case 'DECLINE':
    case 'END':
    case 'CANCEL':
      return { status: 'idle' };
    case 'TOGGLE_MUTE':
      if (state.status === 'active') return { ...state, isMuted: !state.isMuted };
      return state;
    case 'TOGGLE_SPEAKER':
      if (state.status === 'active') return { ...state, isSpeaker: !state.isSpeaker };
      return state;
    case 'CALL_TICK':
      if (state.status === 'active') return { ...state, seconds: state.seconds + 1 };
      return state;
    default:
      return state;
  }
}

interface CallContextType {
  state: CallState;
  contacts: FakeContact[];
  history: CallRecord[];
  settings: AppSettings;
  scheduleCall: (contact: FakeContact, delay: number) => void;
  acceptCall: () => void;
  declineCall: () => void;
  endCall: () => void;
  cancelCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  addContact: (contact: FakeContact) => void;
  updateContact: (contact: FakeContact) => void;
  deleteContact: (id: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  refreshData: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(callReducer, { status: 'idle' });
  const [contacts, setContacts] = useState<FakeContact[]>([]);
  const [history, setHistory] = useState<CallRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ vibrate: true, autoAnswer: false, isPro: false });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStartRef = useRef<number>(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const refreshData = useCallback(async () => {
    const [c, h, s] = await Promise.all([loadContacts(), loadHistory(), loadSettings()]);
    setContacts(c);
    setHistory(h);
    setSettings(s);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cleanup timers on state change
  useEffect(() => {
    if (state.status === 'idle') {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
      stopRingtone();
      stopHaptic();
      stopSpeaking();
    }
  }, [state.status]);

  // Handle ringing side effects
  useEffect(() => {
    if (state.status === 'ringing') {
      playRingtone();
      if (settings.vibrate) triggerRingingHaptic();
    }
  }, [state.status, settings.vibrate]);

  // Handle active call side effects
  useEffect(() => {
    if (state.status === 'active') {
      stopRingtone();
      stopHaptic();
      callStartRef.current = Date.now();
      callTimerRef.current = setInterval(() => dispatch({ type: 'CALL_TICK' }), 1000);
      // Start TTS after 1.5s
      const voiceTimeout = setTimeout(() => {
        if (stateRef.current.status === 'active') {
          speakScript(stateRef.current.contact.voiceScript);
        }
      }, 1500);
      return () => {
        clearTimeout(voiceTimeout);
        if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
      };
    }
  }, [state.status]);

  const scheduleCall = useCallback((contact: FakeContact, delay: number) => {
    dispatch({ type: 'SCHEDULE', contact, delay });
    // Schedule notification for background
    scheduleCallNotification(contact, delay);
    // Start countdown timer
    timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
  }, []);

  const recordCall = useCallback(async (contact: FakeContact, wasAnswered: boolean, duration: number) => {
    const record: CallRecord = {
      id: Date.now().toString(),
      contactId: contact.id,
      contactName: contact.name,
      date: new Date().toISOString(),
      duration,
      wasAnswered,
    };
    const updated = [record, ...history];
    setHistory(updated);
    await saveHistory(updated);
  }, [history]);

  const acceptCall = useCallback(() => {
    cancelNotifications();
    dispatch({ type: 'ACCEPT' });
  }, []);

  const declineCall = useCallback(() => {
    if (state.status === 'ringing') {
      recordCall(state.contact, false, 0);
    }
    cancelNotifications();
    dispatch({ type: 'DECLINE' });
  }, [state, recordCall]);

  const endCall = useCallback(() => {
    if (state.status === 'active') {
      recordCall(state.contact, true, state.seconds);
    }
    stopSpeaking();
    dispatch({ type: 'END' });
  }, [state, recordCall]);

  const cancelCall = useCallback(() => {
    cancelNotifications();
    dispatch({ type: 'CANCEL' });
  }, []);

  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), []);
  const toggleSpeaker = useCallback(() => dispatch({ type: 'TOGGLE_SPEAKER' }), []);

  const addContact = useCallback(async (contact: FakeContact) => {
    const updated = [...contacts, contact];
    setContacts(updated);
    await saveCustomContacts(updated);
  }, [contacts]);

  const updateContact = useCallback(async (contact: FakeContact) => {
    const updated = contacts.map((c) => (c.id === contact.id ? contact : c));
    setContacts(updated);
    await saveCustomContacts(updated);
  }, [contacts]);

  const deleteContact = useCallback(async (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    await saveCustomContacts(updated);
  }, [contacts]);

  const updateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await saveSettings(updated);
  }, [settings]);

  return (
    <CallContext.Provider value={{
      state, contacts, history, settings,
      scheduleCall, acceptCall, declineCall, endCall, cancelCall,
      toggleMute, toggleSpeaker, addContact, updateContact, deleteContact,
      updateSettings, refreshData,
    }}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within CallProvider');
  return ctx;
}
