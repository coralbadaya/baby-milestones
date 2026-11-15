import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/constants/theme';

export function Disclaimer({ audience }: { audience: 'baby' | 'mother' }) {
  const line =
    audience === 'baby'
      ? 'Educational guidance, not a diagnosis. If you are worried about your baby, call your pediatrician or local emergency number.'
      : 'Educational guidance, not a diagnosis. If you are worried about yourself after birth, call your obstetrician or local emergency number.';
  return <Text style={styles.note}>{line}</Text>;
}

const styles = StyleSheet.create({
  note: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
});
