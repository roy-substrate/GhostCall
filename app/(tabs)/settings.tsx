import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCall } from '../../context/CallContext';

const API_KEY_STORAGE_KEY = 'anthropic_api_key';

export default function SettingsScreen() {
  const { settings, updateSettings } = useCall();
  const [apiKey, setApiKey] = useState('');
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const [showKey, setShowKey] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE_KEY).then((key) => {
      if (key) setApiKey(key);
      setApiKeyLoaded(true);
    });
  }, []);

  const saveApiKey = async () => {
    await AsyncStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    Alert.alert('Saved', 'API key saved. AI script generation is now enabled.');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0a0a0f', '#0f1023', '#0a0a0f']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbPurple]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Pro Card */}
        <BlurView intensity={18} tint="dark" style={styles.proCardBlur}>
          <LinearGradient
            colors={['rgba(255,59,92,0.22)', 'rgba(107,78,255,0.12)']}
            style={styles.proCardGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.proCardBorder}>
              <View style={styles.proCardContent}>
                <View style={styles.proHeaderRow}>
                  <Text style={styles.proEmoji}>👑</Text>
                  <View>
                    <Text style={styles.proTitle}>Ghost Call Pro</Text>
                    <Text style={styles.proTagline}>Unlimited everything</Text>
                  </View>
                </View>
                <View style={styles.proBullets}>
                  {['Unlimited contacts & delays', 'AI script generation', 'Priority support'].map((item) => (
                    <View key={item} style={styles.proBulletRow}>
                      <Text style={styles.proBulletCheck}>✓</Text>
                      <Text style={styles.proBulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.priceMain}>$2.99</Text>
                  <Text style={styles.priceSub}>/month  ·  or $14.99/year</Text>
                </View>
                <TouchableOpacity
                  onPress={() => updateSettings({ isPro: !settings.isPro })}
                  activeOpacity={0.82}
                  style={styles.proButtonWrap}
                >
                  <LinearGradient
                    colors={settings.isPro ? ['#30D158', '#1fa344'] : ['#FF3B5C', '#c92b46']}
                    style={styles.proButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.proButtonText}>
                      {settings.isPro ? '✓  Pro Active' : 'Upgrade to Pro'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </BlurView>

        {/* AI Script — API key */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>AI Script Generation</Text>
          <BlurView intensity={12} tint="dark" style={styles.groupCard}>
            <View style={styles.groupCardInner}>
              <View style={styles.cardRow}>
                <View style={styles.cardRowIcon}>
                  <Text>🤖</Text>
                </View>
                <View style={styles.cardRowBody}>
                  <Text style={styles.cardRowTitle}>Anthropic API Key</Text>
                  <Text style={styles.cardRowDesc}>Required to generate AI voice scripts</Text>
                </View>
              </View>
              <View style={styles.apiKeyInputRow}>
                <TextInput
                  style={styles.apiKeyInput}
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder="sk-ant-..."
                  placeholderTextColor="#555"
                  secureTextEntry={!showKey}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowKey(!showKey)} style={styles.eyeButton}>
                  <Text style={styles.eyeText}>{showKey ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={saveApiKey}
                style={styles.saveKeyButton}
                activeOpacity={0.8}
                disabled={!apiKey.trim()}
              >
                <Text style={[styles.saveKeyText, !apiKey.trim() && { opacity: 0.4 }]}>
                  Save API Key
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Call Settings */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Call Settings</Text>
          <BlurView intensity={12} tint="dark" style={styles.groupCard}>
            <View style={styles.groupCardInner}>
              <View style={[styles.cardRow, styles.cardRowBorder]}>
                <View style={styles.cardRowIcon}>
                  <Text>📳</Text>
                </View>
                <View style={styles.cardRowBody}>
                  <Text style={styles.cardRowTitle}>Vibrate on Ring</Text>
                  <Text style={styles.cardRowDesc}>Haptic feedback when call comes in</Text>
                </View>
                <Switch
                  value={settings.vibrate}
                  onValueChange={(v) => updateSettings({ vibrate: v })}
                  trackColor={{ false: '#3A3A3C', true: '#FF3B5C' }}
                  thumbColor="#fff"
                />
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardRowIcon}>
                  <Text>📲</Text>
                </View>
                <View style={styles.cardRowBody}>
                  <Text style={styles.cardRowTitle}>Auto-Answer</Text>
                  <Text style={styles.cardRowDesc}>Automatically accept incoming calls</Text>
                </View>
                <Switch
                  value={settings.autoAnswer}
                  onValueChange={(v) => updateSettings({ autoAnswer: v })}
                  trackColor={{ false: '#3A3A3C', true: '#FF3B5C' }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </BlurView>
        </View>

        {/* About */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>About</Text>
          <BlurView intensity={12} tint="dark" style={styles.groupCard}>
            <View style={styles.groupCardInner}>
              <View style={[styles.cardRow, styles.cardRowBorder]}>
                <Text style={styles.cardRowTitle}>Version</Text>
                <Text style={styles.cardRowValue}>1.0.0</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardRowTitle}>Made with</Text>
                <Text style={styles.cardRowValue}>👻 Ghost Call</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </ScrollView>
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
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.07,
  },
  orbPurple: {
    backgroundColor: '#6B4EFF',
    top: 100,
    right: -60,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.8,
  },
  proCardBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  proCardGrad: {
    borderRadius: 24,
  },
  proCardBorder: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,59,92,0.25)',
  },
  proCardContent: {
    padding: 22,
    gap: 16,
  },
  proHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  proEmoji: {
    fontSize: 36,
  },
  proTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.4,
  },
  proTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  proBullets: {
    gap: 8,
  },
  proBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  proBulletCheck: {
    color: '#30D158',
    fontSize: 14,
    fontWeight: '700',
  },
  proBulletText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceMain: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  priceSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  proButtonWrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  proButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 14,
  },
  proButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionGroup: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.38)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingHorizontal: 4,
  },
  groupCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  groupCardInner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cardRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  cardRowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRowBody: {
    flex: 1,
  },
  cardRowTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  cardRowDesc: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 12,
    marginTop: 2,
  },
  cardRowValue: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 15,
  },
  apiKeyInputRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 4,
    gap: 8,
    alignItems: 'center',
  },
  apiKeyInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  eyeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 16,
  },
  saveKeyButton: {
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 8,
    backgroundColor: 'rgba(107,78,255,0.25)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107,78,255,0.4)',
  },
  saveKeyText: {
    color: '#A78BFA',
    fontSize: 14,
    fontWeight: '700',
  },
});
