import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { ColorValue, Pressable } from 'react-native';

import { colors, fonts } from '@/constants/theme';

const ICONS = {
  today: { ios: 'sun.max', android: 'wb_sunny', web: 'wb_sunny' },
  baby: { ios: 'figure.and.child.holdinghands', android: 'child_care', web: 'child_care' },
  care: { ios: 'heart', android: 'favorite', web: 'favorite' },
  essentials: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
  community: { ios: 'person.2', android: 'groups', web: 'groups' },
} as const;

function TabIcon({ name, color }: { name: (typeof ICONS)[keyof typeof ICONS]; color: ColorValue }) {
  return <SymbolView name={name} tintColor={color} size={24} />;
}

function TabButton({ style, accessibilityState, ...rest }: BottomTabBarButtonProps) {
  const selected = accessibilityState?.selected;
  return (
    <Pressable
      accessibilityState={accessibilityState}
      {...rest}
      style={[
        style,
        {
          borderRadius: 0,
          borderTopWidth: 2,
          borderTopColor: selected ? colors.trail : 'transparent',
        },
      ]}
    />
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
        tabBarButton: (props) => <TabButton {...props} />,
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
          tabBarIcon: ({ color }) => <TabIcon name={ICONS.today} color={color} />,
        }}
      />
      <Tabs.Screen
        name="baby"
        options={{
          title: 'My Baby',
          tabBarIcon: ({ color }) => <TabIcon name={ICONS.baby} color={color} />,
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: 'My Care',
          tabBarIcon: ({ color }) => <TabIcon name={ICONS.care} color={color} />,
        }}
      />
      <Tabs.Screen
        name="essentials"
        options={{
          title: 'Essentials',
          tabBarIcon: ({ color }) => <TabIcon name={ICONS.essentials} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <TabIcon name={ICONS.community} color={color} />,
        }}
      />
    </Tabs>
  );
}
