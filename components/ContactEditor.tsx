import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { FakeContact } from '../lib/types';

interface ContactEditorProps {
  visible: boolean;
  contact?: FakeContact | null;
  onSave: (contact: FakeContact) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['👩', '👨', '👴', '👵', '🧑', '👔', '🏥', '🏢', '🏠', '🎓', '👮', '🧑‍⚕️', '🤵', '💼', '🚗', '✈️'];

export default function ContactEditor({ visible, contact, onSave, onClose }: ContactEditorProps) {
  const [name, setName] = useState(contact?.name ?? '');
  const [phone, setPhone] = useState(contact?.phoneNumber ?? '');
  const [script, setScript] = useState(contact?.voiceScript ?? '');
  const [emoji, setEmoji] = useState(contact?.avatarEmoji ?? '👤');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: contact?.id ?? Date.now().toString(),
      name: name.trim(),
      phoneNumber: phone.trim() || '(555) 000-0000',
      voiceScript: script.trim() || 'Hey, can you talk right now? Something came up.',
      avatarEmoji: emoji,
      isPreset: false,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{contact ? 'Edit Contact' : 'New Contact'}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Avatar</Text>
            <View style={styles.emojiRow}>
              {EMOJI_OPTIONS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[styles.emojiChip, emoji === e && styles.emojiChipSelected]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Roommate"
              placeholderTextColor="#555"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 123-4567"
              placeholderTextColor="#555"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Voice Script</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={script}
              onChangeText={setScript}
              placeholder="What should the caller say when you pick up?"
              placeholderTextColor="#555"
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!name.trim()}
          >
            <Text style={styles.saveText}>Save Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    maxHeight: '85%',
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
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiChipSelected: {
    borderColor: '#FF3B5C',
  },
  emojiText: {
    fontSize: 22,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
  },
});
