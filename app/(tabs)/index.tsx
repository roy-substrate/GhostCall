import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useCall } from '../../context/CallContext';
import WaitingBanner from '../../components/WaitingBanner';
import ScheduleCallSheet from '../../components/ScheduleCallSheet';

export default function HomeScreen() {
  const { state, contacts, history, settings, scheduleCall, cancelCall } = useCall();
  const [showSheet, setShowSheet] = useState(false);

  const recentCalls = history.slice(0, 5);

  return (
    <View style={styles.container}>
      {state.status === 'waiting' && (
        <WaitingBanner
          secondsRemaining={state.secondsRemaining}
          contactName={state.contact.name}
          onCancel={cancelCall}
        />
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowSheet(true)}
          activeOpacity={0.7}
          disabled={state.status !== 'idle'}
        >
          <Text style={styles.mainButtonEmoji}>👻</Text>
          <Text style={styles.mainButtonText}>Schedule a Call</Text>
          <Text style={styles.mainButtonSub}>Escape any situation</Text>
        </TouchableOpacity>

        {/* Presets */}
        <Text style={styles.sectionTitle}>Quick Escape</Text>
        <View style={styles.presetRow}>
          {contacts.filter(c => c.isPreset).map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.presetButton}
              onPress={() => scheduleCall(contact, 5)}
              disabled={state.status !== 'idle'}
              activeOpacity={0.7}
            >
              <Text style={styles.presetEmoji}>{contact.avatarEmoji}</Text>
              <Text style={styles.presetName}>{contact.name}</Text>
              <Text style={styles.presetDelay}>5 sec</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Escapes */}
      <Text style={styles.sectionTitle}>Recent Escapes</Text>
      {recentCalls.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📱</Text>
          <Text style={styles.emptyText}>No calls yet</Text>
          <Text style={styles.emptySubtext}>Schedule your first ghost call above</Text>
        </View>
      ) : (
        <FlatList
          data={recentCalls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyName}>{item.contactName}</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString()} ·{' '}
                  {item.wasAnswered ? `${item.duration}s` : 'Declined'}
                </Text>
              </View>
              <Text style={styles.historyStatus}>
                {item.wasAnswered ? '✅' : '❌'}
              </Text>
            </View>
          )}
        />
      )}

      <ScheduleCallSheet
        visible={showSheet}
        contacts={contacts}
        isPro={settings.isPro}
        onSchedule={scheduleCall}
        onClose={() => setShowSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  quickActions: {
    marginBottom: 24,
  },
  mainButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  mainButtonEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  mainButtonSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  presetEmoji: {
    fontSize: 28,
  },
  presetName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  presetDelay: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    marginTop: 4,
  },
  historyItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyLeft: {
    flex: 1,
  },
  historyName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  historyDate: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 20,
  },
});
