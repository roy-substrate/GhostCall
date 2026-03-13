import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCall } from '../context/CallContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function IncomingCallScreen() {
  const { state, acceptCall, declineCall } = useCall();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (state.status !== 'ringing') {
      if (state.status === 'active') {
        router.replace('/active-call');
      } else if (state.status === 'idle') {
        router.replace('/');
      }
    }
  }, [state.status, router]);

  if (state.status !== 'ringing') return null;
  const contact = state.contact;

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <View style={styles.topSection}>
        <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.avatarEmoji}>{contact.avatarEmoji}</Text>
        </Animated.View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.subtitle}>mobile</Text>
      </View>

      <View style={styles.bottomSection}>
        {/* Decline */}
        <TouchableOpacity
          style={[styles.callButton, styles.declineButton]}
          onPress={declineCall}
          activeOpacity={0.7}
        >
          <Text style={[styles.phoneIcon, { transform: [{ rotate: '135deg' }] }]}>📞</Text>
        </TouchableOpacity>

        {/* Accept */}
        <TouchableOpacity
          style={[styles.callButton, styles.acceptButton]}
          onPress={acceptCall}
          activeOpacity={0.7}
        >
          <Text style={styles.phoneIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.buttonLabel}>Decline</Text>
        <Text style={styles.buttonLabel}>Accept</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 80,
  },
  topSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 56,
  },
  name: {
    fontSize: 32,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '300',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
  },
  callButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#30D158',
  },
  phoneIcon: {
    fontSize: 30,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    marginTop: -20,
  },
  buttonLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '300',
  },
});
