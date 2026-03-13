import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useCall } from '../../context/CallContext';
import ContactEditor from '../../components/ContactEditor';
import { FakeContact } from '../../lib/types';

export default function ContactsScreen() {
  const { contacts, settings, addContact, updateContact, deleteContact } = useCall();
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<FakeContact | null>(null);

  const handleAdd = () => {
    if (!settings.isPro && contacts.filter((c) => !c.isPreset).length >= 0) {
      // Free users can't add custom contacts
      // But let's allow at least trying (the gate message shows)
    }
    setEditingContact(null);
    setEditorVisible(true);
  };

  const handleEdit = (contact: FakeContact) => {
    if (contact.isPreset) return; // Can't edit presets
    setEditingContact(contact);
    setEditorVisible(true);
  };

  const handleDelete = (contact: FakeContact) => {
    if (contact.isPreset) return;
    Alert.alert('Delete Contact', `Remove ${contact.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteContact(contact.id) },
    ]);
  };

  const handleSave = (contact: FakeContact) => {
    if (editingContact) {
      updateContact(contact);
    } else {
      addContact(contact);
    }
  };

  const customContacts = contacts.filter((c) => !c.isPreset);
  const presetContacts = contacts.filter((c) => c.isPreset);

  return (
    <View style={styles.container}>
      <FlatList
        data={[...presetContacts, ...customContacts]}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.7}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Add Contact</Text>
            {!settings.isPro && <Text style={styles.proBadge}>PRO</Text>}
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleEdit(item)}
            onLongPress={() => handleDelete(item)}
            activeOpacity={0.7}
          >
            <View style={styles.contactAvatar}>
              <Text style={styles.contactEmoji}>{item.avatarEmoji}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
            </View>
            {item.isPreset && <Text style={styles.presetBadge}>Preset</Text>}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <ContactEditor
        visible={editorVisible}
        contact={editingContact}
        onSave={handleSave}
        onClose={() => setEditorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  list: {
    padding: 16,
  },
  addButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  addIcon: {
    color: '#FF3B5C',
    fontSize: 24,
    fontWeight: '300',
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  proBadge: {
    color: '#FF3B5C',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(255,59,92,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  contactItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactEmoji: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  contactPhone: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  presetBadge: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
