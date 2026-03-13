import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useCall } from '../../context/CallContext';

export default function SettingsScreen() {
  const { settings, updateSettings } = useCall();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Call Settings</Text>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>Vibrate on Ring</Text>
            <Text style={styles.rowDescription}>Haptic feedback when call comes in</Text>
          </View>
          <Switch
            value={settings.vibrate}
            onValueChange={(v) => updateSettings({ vibrate: v })}
            trackColor={{ false: '#3A3A3C', true: '#FF3B5C' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>Auto-Answer</Text>
            <Text style={styles.rowDescription}>Automatically accept incoming calls</Text>
          </View>
          <Switch
            value={settings.autoAnswer}
            onValueChange={(v) => updateSettings({ autoAnswer: v })}
            trackColor={{ false: '#3A3A3C', true: '#FF3B5C' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.proCard}>
          <Text style={styles.proTitle}>Ghost Call Pro</Text>
          <Text style={styles.proDescription}>
            Unlimited contacts, custom delays, custom ringtones, and more
          </Text>
          <View style={styles.proPricing}>
            <Text style={styles.proPrice}>$2.99/month</Text>
            <Text style={styles.proPriceSep}>or</Text>
            <Text style={styles.proPrice}>$14.99/year</Text>
          </View>
          <TouchableOpacity
            style={[styles.proButton, settings.isPro && styles.proButtonActive]}
            onPress={() => updateSettings({ isPro: !settings.isPro })}
            activeOpacity={0.7}
          >
            <Text style={styles.proButtonText}>
              {settings.isPro ? 'Active' : 'Upgrade to Pro'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
      </View>

      <Text style={styles.footer}>Made with 👻 by Ghost Call</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowInfo: {
    flex: 1,
    marginRight: 12,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  rowDescription: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  rowValue: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
  },
  proCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FF3B5C',
  },
  proTitle: {
    color: '#FF3B5C',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  proDescription: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  proPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  proPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  proPriceSep: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  },
  proButton: {
    backgroundColor: '#FF3B5C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  proButtonActive: {
    backgroundColor: '#30D158',
  },
  proButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
