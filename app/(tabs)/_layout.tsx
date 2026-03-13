import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#000', borderTopColor: '#222' },
        tabBarActiveTintColor: '#FF3B5C',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ghost Call',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👻" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
