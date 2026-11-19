import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { ColorValue, View } from 'react-native';

import { bookColors } from '@/constants/babyBookTheme';
import { colors, fonts } from '@/constants/theme';

const ICONS = {
  today: { ios: 'sun.max', android: 'wb_sunny', web: 'wb_sunny' },
  baby: { ios: 'figure.and.child.holdinghands', android: 'child_care', web: 'child_care' },
  care: { ios: 'heart', android: 'favorite', web: 'favorite' },
  book: { ios: 'book', android: 'menu_book', web: 'menu_book' },
  essentials: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
  community: { ios: 'person.2', android: 'groups', web: 'groups' },
  guides: { ios: 'text.book.closed', android: 'menu_book', web: 'auto_stories' },
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

function PaidTabIcon({
  name,
  focused,
}: {
  name: (typeof ICONS)[keyof typeof ICONS];
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: 'center', marginTop: -18 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: focused ? bookColors.bg : bookColors.bgSoft,
          shadowColor: bookColors.bg,
          shadowOpacity: 0.35,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <SymbolView name={name} tintColor={bookColors.text} size={22} />
      </View>
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
          minHeight: 72,
          paddingTop: 8,
          overflow: 'visible',
        },
        tabBarLabelStyle: { fontFamily: fonts.bodyStrong, fontSize: 11 },
        tabBarItemStyle: { borderRadius: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
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
        name="book"
        options={{
          title: 'Book',
          tabBarLabel: 'Book',
          tabBarIcon: ({ focused }) => <PaidTabIcon name={ICONS.book} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.community} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.guides} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="essentials"
        options={{
          href: null,
          title: 'Essentials',
          tabBarIcon: ({ color, focused }) => <TabIcon name={ICONS.essentials} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
