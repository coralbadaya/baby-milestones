import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { JobLink } from '@/components/JobLink';
import { bookColors } from '@/constants/babyBookTheme';
import { fonts, space } from '@/constants/theme';

const STEPS = [
  { n: '1', title: 'Choose photos', body: 'Stories draw from your monthly album on the web; on the phone, add pages in the 3D Book tab.' },
  { n: '2', title: 'Pick a scene', body: 'Astronaut, artist, explorer, or musician — the same scenes as yarntrails.com.' },
  { n: '3', title: 'Generate', body: 'One free chapter on Basic; unlimited languages and voices on Plus.' },
];

export default function BookStoriesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.eyebrow}>Story Studio</Text>
      <Text style={styles.title}>Stories in your language</Text>
      <Text style={styles.lead}>
        The full Story Studio — languages, folk-tale mode, and voice narration — lives on the website today. The same flow arrives in the app after Plus billing is connected.
      </Text>

      <View style={styles.steps}>
        {STEPS.map((step) => (
          <View key={step.n} style={styles.step}>
            <Text style={styles.stepNum}>{step.n}</Text>
            <View style={styles.stepCopy}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Button label="Add pages on this phone" onPress={() => router.push('/book/album')} />

      <View style={styles.links}>
        <JobLink href="/plus" label="Yarn Trails Plus" detail="HD photos, unlimited stories, full 3D book" accent />
        <JobLink href="/login" label="Sign in" detail="Same account as yarntrails.com" />
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
  steps: { gap: 10 },
  step: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: bookColors.border,
    backgroundColor: bookColors.surface,
  },
  stepNum: {
    fontFamily: fonts.bodyStrong,
    fontSize: 14,
    color: bookColors.accent,
    width: 20,
  },
  stepCopy: { flex: 1, gap: 4 },
  stepTitle: {
    fontFamily: fonts.bodyStrong,
    fontSize: 15,
    color: bookColors.text,
  },
  stepBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: bookColors.textMuted,
  },
  links: { gap: 10, marginTop: 8 },
});