import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IDEA_COLLECTIONS } from '@/content/babyBook';
import { bookColors } from '@/constants/babyBookTheme';
import { fonts, space } from '@/constants/theme';

export default function BookIdeasScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.eyebrow}>Idea Studio</Text>
      <Text style={styles.title}>Little moments. Beautiful stories.</Text>
      <Text style={styles.lead}>
        Ten keepsake ideas, grouped like the website. Full AI layouts and photo pickers sync with your account on yarntrails.com; on the phone, start with photographs in the 3D Book tab.
      </Text>

      {IDEA_COLLECTIONS.map((collection) => (
        <View key={collection.id} style={styles.collection}>
          <Text style={styles.collectionTitle}>{collection.heading}</Text>
          <Text style={styles.collectionSub}>{collection.supporting}</Text>
          <View style={styles.ideaList}>
            {collection.ideas.map((idea) => (
              <Pressable
                key={idea}
                accessibilityRole="button"
                onPress={() => router.push('/book/album')}
                style={styles.ideaCard}
              >
                <Text style={styles.ideaTitle}>{idea}</Text>
                <Text style={styles.ideaCta}>Choose photos →</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space.screen,
    paddingBottom: 48,
    gap: 20,
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
  collection: { gap: 8 },
  collectionTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    color: bookColors.text,
  },
  collectionSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: bookColors.textMuted,
  },
  ideaList: { gap: 8, marginTop: 4 },
  ideaCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: bookColors.border,
    backgroundColor: bookColors.surface,
    gap: 6,
  },
  ideaTitle: {
    fontFamily: fonts.bodyStrong,
    fontSize: 15,
    color: bookColors.text,
  },
  ideaCta: {
    fontFamily: fonts.bodyStrong,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: bookColors.accent,
  },
});