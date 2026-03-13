import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface CallControlButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  size?: number;
  iconRotation?: number;
  isActive?: boolean;
}

export default function CallControlButton({
  icon,
  label,
  onPress,
  backgroundColor = 'rgba(255,255,255,0.1)',
  size = 64,
  iconRotation = 0,
  isActive = false,
}: CallControlButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isActive ? '#fff' : backgroundColor,
          },
        ]}
      >
        <Text
          style={[
            styles.icon,
            { fontSize: size * 0.4, transform: [{ rotate: `${iconRotation}deg` }] },
            isActive && { color: '#000' },
          ]}
        >
          {icon}
        </Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    color: '#fff',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '300',
  },
});
