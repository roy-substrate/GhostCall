import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCall } from '../context/CallContext';
import { useRouter } from 'expo-router';
import { formatTime } from '../lib/formatTime';
import CallControlButton from '../components/CallControlButton';

export default function ActiveCallScreen() {
  const { state, endCall, toggleMute, toggleSpeaker } = useCall();
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'idle') {
      router.replace('/');
    }
  }, [state.status, router]);

  if (state.status !== 'active') return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>{state.contact.avatarEmoji}</Text>
        </View>
        <Text style={styles.name}>{state.contact.name}</Text>
        <Text style={styles.timer}>{formatTime(state.seconds)}</Text>
      </View>

      <View style={styles.controlsGrid}>
        <CallControlButton
          icon="🔇"
          label="mute"
          onPress={toggleMute}
          isActive={state.isMuted}
        />
        <CallControlButton
          icon="⌨️"
          label="keypad"
          onPress={() => {}}
        />
        <CallControlButton
          icon="🔊"
          label="speaker"
          onPress={toggleSpeaker}
          isActive={state.isSpeaker}
        />
        <CallControlButton
          icon="➕"
          label="add call"
          onPress={() => {}}
        />
        <CallControlButton
          icon="📹"
          label="FaceTime"
          onPress={() => {}}
        />
        <CallControlButton
          icon="👤"
          label="contacts"
          onPress={() => {}}
        />
      </View>

      <View style={styles.endSection}>
        <TouchableOpacity style={styles.endButton} onPress={endCall} activeOpacity={0.7}>
          <Text style={styles.endIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 60,
  },
  topSection: {
    alignItems: 'center',
    gap: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: '200',
    color: '#fff',
  },
  timer: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '300',
    marginTop: 4,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 40,
  },
  endSection: {
    alignItems: 'center',
  },
  endButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  endIcon: {
    fontSize: 30,
  },
});
