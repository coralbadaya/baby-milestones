import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, space } from '@/constants/theme';

export function JobLink({
  href,
  label,
  detail,
  accent = false,
}: {
  href:
    | '/baby'
    | '/book'
    | '/care'
    | '/vaccination'
    | '/guides'
    | '/plus'
    | '/birth'
    | '/login'
    | '/shopping'
    | '/travel'
    | '/progress'
    | '/mom-feed'
    | '/recipes'
    | '/tips';
  label: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={StyleSheet.flatten([styles.row, accent ? styles.accent : null])}>
        <View style={styles.copy}>
          <Text style={StyleSheet.flatten([styles.label, accent ? styles.accentText : null])}>{label}</Text>
          <Text style={StyleSheet.flatten([styles.detail, accent ? styles.accentDetail : null])}>{detail}</Text>
        </View>
        <Text style={StyleSheet.flatten([styles.chevron, accent ? styles.accentText : null])}>›</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: space.target,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 0,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accent: {
    backgroundColor: colors.trail,
    borderColor: colors.trail,
  },
  copy: { flex: 1, gap: 2 },
  label: {
    fontFamily: fonts.bodyStrong,
    fontSize: 17,
    color: colors.text,
  },
  detail: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  accentText: { color: colors.white },
  accentDetail: { color: colors.trailTint },
  chevron: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.trail,
    lineHeight: 32,
  },
});
