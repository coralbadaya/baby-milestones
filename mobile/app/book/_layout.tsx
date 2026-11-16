import { SymbolView } from 'expo-symbols';
import { Tabs, router } from 'expo-router';
import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native';

import { BabyBookBackground } from '@/components/book/BabyBookBackground';
import { BABY_BOOK_TABS } from '@/content/babyBook';
import { bookColors } from '@/constants/babyBookTheme';
import { fonts } from '@/constants/theme';

function BookTabIcon({
  name,
  color,
  focused,
}: {
  name: (typeof BABY_BOOK_TABS)[number]['icon'];
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <View style={styles.iconWrap}>
      <View style={[styles.trailLine, focused && styles.trailLineOn]} />
      <SymbolView name={name} tintColor={color} size={20} />
    </View>
  );
}

export default function BabyBookLayout() {
  return (
    <View style={styles.shell}>
      <BabyBookBackground />
      <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: 'rgba(45, 31, 78, 0.92)' },
        headerTintColor: bookColors.text,
        headerTitleStyle: { fontFamily: fonts.bodyStrong, color: bookColors.text },
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={styles.back}
          >
            <Text style={styles.backLabel}>← Back</Text>
          </Pressable>
        ),
        tabBarActiveTintColor: bookColors.accent,
        tabBarInactiveTintColor: bookColors.textMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 20, 50, 0.96)',
          borderTopColor: bookColors.border,
          minHeight: 64,
        },
        tabBarLabelStyle: { fontFamily: fonts.bodyStrong, fontSize: 10 },
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      {BABY_BOOK_TABS.map((tab) => (
        <Tabs.Screen
          key={tab.id}
          name={tab.id}
          options={{
            title: tab.label,
            headerTitle: tab.id === 'home' ? 'Baby Book' : tab.label,
            tabBarIcon: ({ color, focused }) => (
              <BookTabIcon name={tab.icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: bookColors.bg,
  },
  back: {
    minHeight: 44,
    justifyContent: 'center',
    paddingRight: 12,
  },
  backLabel: {
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    color: bookColors.text,
  },
  iconWrap: { alignItems: 'center', gap: 4 },
  trailLine: {
    width: 24,
    height: 2,
    backgroundColor: 'transparent',
  },
  trailLineOn: {
    backgroundColor: bookColors.accent,
  },
});