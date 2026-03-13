import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useCall } from '../../context/CallContext';
import { formatTime } from '../../lib/formatTime';

export default function HistoryScreen() {
  const { history } = useCall();

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No call history</Text>
        <Text style={styles.emptySubtext}>Your ghost calls will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const date = new Date(item.date);
          return (
            <View style={styles.item}>
              <View style={styles.iconContainer}>
                <Text style={styles.statusIcon}>{item.wasAnswered ? '📞' : '📵'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.contactName}</Text>
                <Text style={styles.details}>
                  {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.rightSection}>
                <Text style={[styles.status, item.wasAnswered ? styles.answered : styles.declined]}>
                  {item.wasAnswered ? 'Answered' : 'Declined'}
                </Text>
                {item.wasAnswered && (
                  <Text style={styles.duration}>{formatTime(item.duration)}</Text>
                )}
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
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
  item: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  details: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  answered: {
    color: '#30D158',
  },
  declined: {
    color: '#FF3B30',
  },
  duration: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
    fontWeight: '500',
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    marginTop: 4,
  },
});
