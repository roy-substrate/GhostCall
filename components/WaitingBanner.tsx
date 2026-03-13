import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatTime } from '../lib/formatTime';

interface WaitingBannerProps {
  secondsRemaining: number;
  contactName: string;
  onCancel: () => void;
}

export default function WaitingBanner({ secondsRemaining, contactName, onCancel }: WaitingBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.label}>Incoming call in</Text>
        <Text style={styles.timer}>{formatTime(secondsRemaining)}</Text>
        <Text style={styles.contact}>from {contactName}</Text>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  info: {
    flex: 1,
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '300',
  },
  timer: {
    color: '#FF3B5C',
    fontSize: 28,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  contact: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,59,92,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelText: {
    color: '#FF3B5C',
    fontSize: 15,
    fontWeight: '600',
  },
});
