import { Disclaimer } from '@/components/Disclaimer';
import { JobLink } from '@/components/JobLink';
import { Body, Screen, Title } from '@/components/Screen';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';

export default function BabyScreen() {
  return (
    <Screen>
      <Title>My Baby</Title>
      <Body>
        Milestones for the month Today already named. Checking them off stays free, and it will use the same list as the website.
      </Body>

      <View style={styles.bookBand}>
        <Text style={styles.bookEyebrow}>Yarn Trails Plus</Text>
        <Text style={styles.bookTitle}>Your baby book</Text>
        <Text style={styles.bookSub}>
          AI stories, Idea Studio, the 3D flip-book, and Family Circle — the same five tabs as yarntrails.com.
        </Text>
        <JobLink
          href="/book/home"
          label="Open baby book"
          detail="Home · Stories · Ideas · 3D Book · Family"
          accent
        />
        <JobLink href="/book/stories" label="Story Studio" detail="Turn this month into a chapter" />
      </View>

      <Disclaimer audience="baby" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bookBand: {
    gap: 10,
    paddingVertical: 8,
  },
  bookEyebrow: {
    fontFamily: fonts.bodyStrong,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.trail,
  },
  bookTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 24,
    color: colors.text,
  },
  bookSub: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});