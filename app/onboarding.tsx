import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export const ONBOARDING_KEY = 'onboarding_complete';

interface Page {
  emoji: string;
  title: string;
  subtitle: string;
  bullets: { icon: string; text: string }[];
  bgColors: [string, string, ...string[]];
  accentColor: string;
}

const PAGES: Page[] = [
  {
    emoji: '👻',
    title: 'Escape Any\nSituation',
    subtitle: 'A realistic fake call, right when you need it most.',
    bullets: [
      { icon: '📞', text: 'Looks & sounds like a real call' },
      { icon: '⚡', text: 'One tap — escape in seconds' },
      { icon: '🔒', text: '100% offline & private' },
    ],
    bgColors: ['#0a0a0f', '#0f1a35', '#1a2a5e'],
    accentColor: '#4A90FF',
  },
  {
    emoji: '✨',
    title: 'AI Writes\nYour Script',
    subtitle: 'Pick a scenario. AI generates a convincing script — content makes itself.',
    bullets: [
      { icon: '🚨', text: 'Emergency, Work, Medical & more' },
      { icon: '🤖', text: 'AI personalizes every script' },
      { icon: '🎙️', text: 'Text-to-speech plays it live' },
    ],
    bgColors: ['#0a0a0f', '#15083a', '#3d1f8e'],
    accentColor: '#A855F7',
  },
  {
    emoji: '🏆',
    title: 'Go Pro,\nUnlock All',
    subtitle: 'Unlimited contacts, AI scripts, and every escape option available.',
    bullets: [
      { icon: '♾️', text: 'Unlimited contacts & delays' },
      { icon: '✨', text: 'AI script generation per contact' },
      { icon: '🎵', text: 'Custom ringtones — coming soon' },
    ],
    bgColors: ['#0a0a0f', '#2a0a15', '#5c1528'],
    accentColor: '#FF3B5C',
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(index);
  };

  const goNext = () => {
    if (page < PAGES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (page + 1), animated: true });
    }
  };

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  const isLast = page === PAGES.length - 1;
  const current = PAGES[page];

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {PAGES.map((p, i) => (
          <LinearGradient
            key={i}
            colors={p.bgColors}
            style={styles.page}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          >
            {/* Orb glow */}
            <View style={[styles.orb, { backgroundColor: p.accentColor }]} />

            {/* Floating emoji card — liquid glass */}
            <BlurView intensity={20} tint="dark" style={styles.emojiCard}>
              <View style={[styles.emojiCardInner, { borderColor: `${p.accentColor}40` }]}>
                <Text style={styles.pageEmoji}>{p.emoji}</Text>
              </View>
            </BlurView>

            <Text style={styles.pageTitle}>{p.title}</Text>
            <Text style={styles.pageSubtitle}>{p.subtitle}</Text>

            {/* Liquid glass bullet card */}
            <BlurView intensity={16} tint="dark" style={styles.bulletCard}>
              <View style={[styles.bulletCardInner, { borderColor: `${p.accentColor}30` }]}>
                {p.bullets.map((b, bi) => (
                  <View key={bi} style={[styles.bulletRow, bi < p.bullets.length - 1 && styles.bulletRowBorder]}>
                    <View style={[styles.bulletIconWrap, { backgroundColor: `${p.accentColor}20` }]}>
                      <Text style={styles.bulletIcon}>{b.icon}</Text>
                    </View>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            </BlurView>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {PAGES.map((p, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === page && { width: 22, backgroundColor: current.accentColor },
            ]}
          />
        ))}
      </View>

      {/* Bottom action area — liquid glass */}
      <BlurView intensity={40} tint="dark" style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <TouchableOpacity
            onPress={isLast ? finish : goNext}
            activeOpacity={0.82}
            style={styles.primaryButtonWrap}
          >
            <LinearGradient
              colors={isLast ? ['#FF3B5C', '#d42e4e'] : [current.accentColor, `${current.accentColor}bb`]}
              style={styles.primaryButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>
                {isLast ? 'Get Started  →' : 'Continue  →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {!isLast && (
            <TouchableOpacity onPress={finish} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  page: {
    width,
    minHeight: height,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 72,
    paddingHorizontal: 28,
    paddingBottom: 220,
  },
  orb: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    top: -60,
    opacity: 0.12,
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
  },
  emojiCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 36,
  },
  emojiCardInner: {
    width: 120,
    height: 120,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pageEmoji: {
    fontSize: 60,
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: 48,
    marginBottom: 14,
  },
  pageSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 280,
  },
  bulletCard: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
  },
  bulletCardInner: {
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bulletRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  bulletIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletIcon: {
    fontSize: 18,
  },
  bulletText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    bottom: 178,
    left: 0,
    right: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBarInner: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  primaryButtonWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryButton: {
    paddingVertical: 17,
    alignItems: 'center',
    borderRadius: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 15,
  },
});
