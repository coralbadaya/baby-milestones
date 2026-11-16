import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { JobLink } from '@/components/JobLink';
import { bookColors } from '@/constants/babyBookTheme';
import { fonts, space } from '@/constants/theme';

export default function BookFamilyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.eyebrow}>Family Circle</Text>
      <Text style={styles.title}>All the love around you</Text>
      <Text style={styles.lead}>
        Voice blessings, grandparent invites, and the letter sealed until age 18 live in the web baby book today. Sign in on the phone with the same email code to share one account with yarntrails.com.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Time capsule</Text>
        <Text style={styles.panelBody}>
          Write a letter now — it stays sealed in the app and can print as a closed page. Editing after seal is not available yet on mobile.
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Voice blessings</Text>
        <Text style={styles.panelBody}>
          Grandparents record a short blessing after you invite them. Playback and approval stay on the website until native recording ships here.
        </Text>
      </View>

      <View style={styles.links}>
        <JobLink href="/login" label="Sign in" detail="Family Circle on your web account" />
        <JobLink href="/plus" label="Plus" detail="Viewer seats and print perks" accent />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space.screen,
    paddingBottom: 40,
    gap: 16,
  },
  eyebrow: {
    fontFamily: fonts.bodyStrong,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: bookColors.accent,
  },
  title: {
    fontFamily: fonts.displayItalic,
    fontSize: 26,
    color: bookColors.text,
  },
  lead: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: bookColors.textMuted,
  },
  panel: {
    padding: 14,
    borderWidth: 1,
    borderColor: bookColors.border,
    backgroundColor: bookColors.surface,
    gap: 6,
  },
  panelTitle: {
    fontFamily: fonts.bodyStrong,
    fontSize: 15,
    color: bookColors.text,
  },
  panelBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: bookColors.textMuted,
  },
  links: { gap: 10, marginTop: 8 },
});