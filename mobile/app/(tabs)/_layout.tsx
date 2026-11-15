import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { ColorValue, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

const ICONS = {
  today: { ios: 'sun.max', android: 'wb_sunny', web: 'wb_sunny' },
  baby: { ios: 'figure.and.child.holdinghands', android: 'child_care', web: 'child_care' },
  care: { ios: 'heart', android: 'favorite', web: 'favorite' },
  essentials: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
  community: { ios: 'person.2', android: 'groups', web: 'groups' },
} as const;

function TabIcon({
  name,
  color,
  focused,
}: {
  name: (typeof ICONS)[keyof typeof ICONS];
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', gap: 4, borderRadius: 0 }}>
      <View
        style={{
          width: 28,
          height: 2,
          backgroundColor: focused ? colors.trail : 'transparent',
        }}
      />
      <SymbolView name={name} tintColor={color} size={22} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.bodyStrong, color: colors.text },
        tabBarActiveTintColor: colors.trail,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.border,
          minHeight: 64,
        },
        tabBarLabelStyle: { fontFamily: fonts.bodyStrong, fontSize: 11 },
        tabBarItemStyle: { borderRadius: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.today} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="baby"
        options={{
          title: 'My Baby',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.baby} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: 'My Care',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.care} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="essentials"
        options={{
          title: 'Essentials',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.essentials} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.community} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
