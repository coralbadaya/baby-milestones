import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, space } from '@/constants/theme';

export function Screen({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.fill}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: space.screen + insets.bottom }]}
      >
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
    </View>
  );
}

export function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Body({ children }: { children: string }) {
  return <Text style={styles.body}>{children}</Text>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.cream },
  content: { padding: space.screen, gap: space.stack },
  footer: {
    paddingHorizontal: space.screen,
    paddingTop: 12,
    backgroundColor: colors.cream,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  eyebrow: {
    fontFamily: fonts.bodyStrong,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.trail,
  },
  title: {
    fontFamily: fonts.displayItalic,
    fontSize: 36,
    lineHeight: 42,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 17,
    lineHeight: 26,
    color: colors.textSecondary,
  },
});
