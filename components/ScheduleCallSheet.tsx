import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { FakeContact } from '../lib/types';

interface ScheduleCallSheetProps {
  visible: boolean;
  contacts: FakeContact[];
  isPro: boolean;
  onSchedule: (contact: FakeContact, delay: number) => void;
  onClose: () => void;
}

const FREE_DELAYS = [
  { label: '5 sec', value: 5 },
  { label: '15 sec', value: 15 },
  { label: '30 sec', value: 30 },
];

const PRO_DELAYS = [
  ...FREE_DELAYS,
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
];

export default function ScheduleCallSheet({ visible, contacts, isPro, onSchedule, onClose }: ScheduleCallSheetProps) {
  const [selectedContact, setSelectedContact] = useState<FakeContact | null>(null);
  const [selectedDelay, setSelectedDelay] = useState<number>(15);
  const delays = isPro ? PRO_DELAYS : FREE_DELAYS;

  const handleSchedule = () => {
    if (selectedContact) {
      onSchedule(selectedContact, selectedDelay);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Schedule a Call</Text>

          <Text style={styles.sectionTitle}>Who's calling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactRow}>
            {contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactChip,
                  selectedContact?.id === contact.id && styles.contactChipSelected,
                ]}
                onPress={() => setSelectedContact(contact)}
              >
                <Text style={styles.contactEmoji}>{contact.avatarEmoji}</Text>
                <Text style={[
                  styles.contactName,
                  selectedContact?.id === contact.id && styles.contactNameSelected,
                ]}>
                  {contact.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Call me in...</Text>
          <View style={styles.delayRow}>
            {delays.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[styles.delayChip, selectedDelay === d.value && styles.delayChipSelected]}
                onPress={() => setSelectedDelay(d.value)}
              >
                <Text style={[
                  styles.delayText,
                  selectedDelay === d.value && styles.delayTextSelected,
                ]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.scheduleButton, !selectedContact && styles.scheduleButtonDisabled]}
            onPress={handleSchedule}
            disabled={!selectedContact}
            activeOpacity={0.7}
          >
            <Text style={styles.scheduleButtonText}>Schedule Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  contactRow: {
    marginBottom: 24,
  },
  contactChip: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contactChipSelected: {
    borderColor: '#FF3B5C',
    backgroundColor: 'rgba(255,59,92,0.1)',
  },
  contactEmoji: {
    fontSize: 24,
  },
  contactName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  contactNameSelected: {
    color: '#FF3B5C',
  },
  delayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  delayChip: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  delayChipSelected: {
    borderColor: '#FF3B5C',
    backgroundColor: 'rgba(255,59,92,0.1)',
  },
  delayText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  delayTextSelected: {
    color: '#FF3B5C',
  },
  scheduleButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleButtonDisabled: {
    opacity: 0.4,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
});
