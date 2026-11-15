import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, space } from '@/constants/theme';

export function Button({
  label,
  onPress,
  tone = 'primary',
}: {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'quiet';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, tone === 'quiet' && styles.quiet]}
      accessibilityRole="button"
    >
      <Text style={[styles.label, tone === 'quiet' && styles.quietLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: space.target,
    borderRadius: 0,
    backgroundColor: colors.trail,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.trail,
  },
  label: {
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    color: colors.white,
  },
  quietLabel: { color: colors.trailDark },
});
