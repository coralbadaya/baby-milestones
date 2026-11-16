import { StyleSheet, Text, View } from 'react-native';

import { JobLink } from '@/components/JobLink';
import { Body, Eyebrow, Screen, Title } from '@/components/Screen';
import { colors, fonts } from '@/constants/theme';
import { BOOK_WAYS, PLUS_FEATURES, PLUS_PRICE, PLUS_PRICE_NOTE } from '@/content/plus';

export default function PlusScreen() {
  return (
    <Screen>
      <Eyebrow>Yarn Trails Plus</Eyebrow>
      <Title>The book is the paid part.</Title>
      <Body>
        Milestones, care, and vaccination stay free. Plus is the private baby book: photographs, stories, or both, set the way you want each spread.
      </Body>
      <Text style={styles.price}>{PLUS_PRICE}</Text>
      <Text style={styles.note}>{PLUS_PRICE_NOTE}</Text>
      <Text style={styles.note}>
        On iPhone, Apple will bill the membership. On Android, Google Play will. This screen does not charge yet. A printed book stays a purchase on the website.
      </Text>

      <Text style={styles.section}>What changes with Plus</Text>
      {PLUS_FEATURES.map((feature) => (
        <View key={feature.label} style={styles.row}>
          <Text style={styles.label}>{feature.label}</Text>
          <Text style={styles.basic}>Basic · {feature.basic}</Text>
          <Text style={styles.plus}>Plus · {feature.plus}</Text>
        </View>
      ))}

      <Text style={styles.section}>How a spread can look</Text>
      {BOOK_WAYS.map((way) => (
        <Text key={way} style={styles.way}>{way}</Text>
      ))}

      <JobLink href="/book/home" label="Open baby book" detail="Home · Stories · Ideas · 3D Book · Family" accent />
      <JobLink href="/login" label="Sign in first" detail="Plus follows the account" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  price: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  section: {
    fontFamily: fonts.bodyStrong,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.trail,
    marginTop: 8,
  },
  row: {
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  label: { fontFamily: fonts.displayItalic, fontSize: 22, lineHeight: 26, color: colors.text },
  basic: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.textSecondary },
  plus: { fontFamily: fonts.bodyStrong, fontSize: 16, lineHeight: 22, color: colors.trailDark },
  way: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.text },
});
