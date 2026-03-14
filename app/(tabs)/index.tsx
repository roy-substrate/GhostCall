import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useCall } from '../../context/CallContext';
import WaitingBanner from '../../components/WaitingBanner';
import ScheduleCallSheet from '../../components/ScheduleCallSheet';

export default function HomeScreen() {
  const { state, contacts, history, settings, scheduleCall, cancelCall } = useCall();
  const [showSheet, setShowSheet] = useState(false);

  const recentCalls = history.slice(0, 5);
  const isIdle = state.status === 'idle';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0a0a0f', '#0f1023', '#0a0a0f']}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient orbs */}
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {state.status === 'waiting' && (
          <WaitingBanner
            secondsRemaining={state.secondsRemaining}
            contactName={state.contact.name}
            onCancel={cancelCall}
          />
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerGreeting}>Ghost Call</Text>
          <Text style={styles.headerSub}>Escape anything, instantly</Text>
        </View>

        {/* Main CTA — Liquid glass card */}
        <TouchableOpacity
          onPress={() => setShowSheet(true)}
          activeOpacity={0.82}
          disabled={!isIdle}
          style={[styles.mainCardWrap, !isIdle && styles.disabled]}
        >
          <BlurView intensity={18} tint="dark" style={styles.mainCardBlur}>
            <LinearGradient
              colors={['rgba(255,59,92,0.18)', 'rgba(255,59,92,0.04)']}
              style={styles.mainCardGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.mainCardBorder}>
                <View style={styles.mainCardContent}>
                  <View style={styles.ghostBadge}>
                    <Text style={styles.ghostEmoji}>👻</Text>
                  </View>
                  <View style={styles.mainCardText}>
                    <Text style={styles.mainCardTitle}>Schedule a Call</Text>
                    <Text style={styles.mainCardSub}>Escape any situation instantly</Text>
                  </View>
                  <View style={styles.mainCardArrow}>
                    <Text style={styles.mainCardArrowText}>›</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        {/* Quick Escape section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Escape</Text>
          <View style={styles.presetRow}>
            {contacts.filter(c => c.isPreset).map((contact) => (
              <TouchableOpacity
                key={contact.id}
                onPress={() => scheduleCall(contact, 5)}
                disabled={!isIdle}
                activeOpacity={0.75}
                style={[styles.presetCardWrap, !isIdle && styles.disabled]}
              >
                <BlurView intensity={14} tint="dark" style={styles.presetBlur}>
                  <View style={styles.presetCardInner}>
                    <Text style={styles.presetEmoji}>{contact.avatarEmoji}</Text>
                    <Text style={styles.presetName}>{contact.name}</Text>
                    <View style={styles.presetDelay}>
                      <Text style={styles.presetDelayText}>5s</Text>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Escapes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Escapes</Text>
          {recentCalls.length === 0 ? (
            <BlurView intensity={12} tint="dark" style={styles.emptyCard}>
              <View style={styles.emptyCardInner}>
                <Text style={styles.emptyEmoji}>📱</Text>
                <Text style={styles.emptyTitle}>No calls yet</Text>
                <Text style={styles.emptySubtext}>Schedule your first ghost call above</Text>
              </View>
            </BlurView>
          ) : (
            <BlurView intensity={12} tint="dark" style={styles.historyCard}>
              <View style={styles.historyCardInner}>
                {recentCalls.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.historyRow,
                      index < recentCalls.length - 1 && styles.historyRowBorder,
                    ]}
                  >
                    <View style={styles.historyIcon}>
                      <Text style={styles.historyIconText}>
                        {item.wasAnswered ? '📞' : '📵'}
                      </Text>
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyName}>{item.contactName}</Text>
                      <Text style={styles.historyDate}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })} · {item.wasAnswered ? `${item.duration}s` : 'Declined'}
                      </Text>
                    </View>
                    <View style={[styles.historyBadge, item.wasAnswered ? styles.badgeGreen : styles.badgeRed]}>
                      <Text style={styles.historyBadgeText}>
                        {item.wasAnswered ? 'Answered' : 'Declined'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </BlurView>
          )}
        </View>
      </ScrollView>

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
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.08,
  },
  orbTop: {
    backgroundColor: '#FF3B5C',
    top: -80,
    left: -60,
  },
  orbBottom: {
    backgroundColor: '#6B4EFF',
    bottom: 100,
    right: -80,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    paddingBottom: 40,
    gap: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    paddingVertical: 12,
  },
  headerGreeting: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.8,
  },
  headerSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    fontWeight: '500',
  },
  mainCardWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  mainCardBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  mainCardGrad: {
    borderRadius: 24,
  },
  mainCardBorder: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.3)',
    overflow: 'hidden',
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  ghostBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,59,92,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostEmoji: {
    fontSize: 28,
  },
  mainCardText: {
    flex: 1,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  mainCardSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
  },
  mainCardArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCardArrowText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 22,
    fontWeight: '300',
    marginTop: -2,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingHorizontal: 4,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetCardWrap: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  presetBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  presetCardInner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  presetEmoji: {
    fontSize: 30,
  },
  presetName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  presetDelay: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  presetDelayText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyCardInner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 40,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  historyCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  historyCardInner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  historyRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  historyIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyIconText: {
    fontSize: 18,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  historyDate: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 12,
    marginTop: 2,
  },
  historyBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeGreen: {
    backgroundColor: 'rgba(48,209,88,0.15)',
  },
  badgeRed: {
    backgroundColor: 'rgba(255,59,48,0.15)',
  },
  historyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
});
