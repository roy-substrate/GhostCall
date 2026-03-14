import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FakeContact, CallScenario, SCENARIOS } from '../lib/types';
import { generateVoiceScript } from '../lib/aiScriptGenerator';

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
  const [scenario, setScenario] = useState<CallScenario>(contact?.scenario ?? 'custom');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: contact?.id ?? Date.now().toString(),
      name: name.trim(),
      phoneNumber: phone.trim() || '(555) 000-0000',
      voiceScript: script.trim() || 'Hey, can you talk right now? Something came up.',
      avatarEmoji: emoji,
      isPreset: false,
      scenario,
    });
    onClose();
  };

  const handleGenerateScript = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Enter a contact name first so AI can personalize the script.');
      return;
    }
    setIsGenerating(true);
    try {
      const generated = await generateVoiceScript(name.trim(), scenario);
      setScript(generated);
    } catch (err: any) {
      Alert.alert(
        'Generation Failed',
        err?.message ?? 'Could not generate script. Check your API key in Settings.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{contact ? 'Edit Contact' : 'New Contact'}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar */}
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

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Roommate"
              placeholderTextColor="#555"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 123-4567"
              placeholderTextColor="#555"
              keyboardType="phone-pad"
            />

            {/* Scenario */}
            <Text style={styles.label}>Scenario</Text>
            <View style={styles.scenarioGrid}>
              {SCENARIOS.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.scenarioChip, scenario === s.id && styles.scenarioChipSelected]}
                  onPress={() => setScenario(s.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.scenarioEmoji}>{s.emoji}</Text>
                  <Text style={[styles.scenarioLabel, scenario === s.id && styles.scenarioLabelSelected]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Voice Script */}
            <View style={styles.scriptHeader}>
              <Text style={styles.label}>Voice Script</Text>
              <TouchableOpacity
                style={[styles.aiButton, isGenerating && styles.aiButtonDisabled]}
                onPress={handleGenerateScript}
                disabled={isGenerating}
                activeOpacity={0.7}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.aiButtonText}>✨ Generate with AI</Text>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={script}
              onChangeText={setScript}
              placeholder="What should the caller say when you pick up?"
              placeholderTextColor="#555"
              multiline
              numberOfLines={4}
            />
            {scenario !== 'custom' && (
              <Text style={styles.aiHint}>
                Tap "Generate with AI" to create a realistic {SCENARIOS.find(s => s.id === scenario)?.label.toLowerCase()} script
              </Text>
            )}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 44,
    maxHeight: '92%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#48484A',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  label: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 20,
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
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scenarioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  scenarioChipSelected: {
    borderColor: '#FF3B5C',
    backgroundColor: 'rgba(255,59,92,0.1)',
  },
  scenarioEmoji: {
    fontSize: 15,
  },
  scenarioLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
  },
  scenarioLabelSelected: {
    color: '#FF3B5C',
    fontWeight: '600',
  },
  scriptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B4EFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    justifyContent: 'center',
  },
  aiButtonDisabled: {
    opacity: 0.5,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  aiHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  saveButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  cancelText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
  },
});
