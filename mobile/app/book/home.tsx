import { useFocusEffect, Link, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FEATURE_CAROUSEL } from '@/content/babyBook';
import { bookColors } from '@/constants/babyBookTheme';
import { colors, fonts, space } from '@/constants/theme';
import { readBirthDate } from '@/lib/birthDate';
import { readPhotos } from '@/lib/localBook';
import { monthAge, monthLabel } from '@/lib/monthAge';

export default function BookHomeScreen() {
  const [dob, setDob] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all([readBirthDate(), readPhotos()])
        .then(([birth, photos]) => {
          if (!alive) return;
          setDob(birth);
          setPhotoCount(photos.length);
        })
        .catch(() => {
          if (alive) {
            setDob(null);
            setPhotoCount(0);
          }
        });
      return () => {
        alive = false;
      };
    }, []),
  );

  const month = dob ? monthAge(new Date(), dob) : null;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.eyebrow}>Memory Lane</Text>
      <Text style={styles.heroTitle}>
        {month != null ? monthLabel(month) : 'Your first year'}
      </Text>
      <Text style={styles.heroSub}>
        {photoCount > 0
          ? `${photoCount} photograph${photoCount === 1 ? '' : 's'} on this phone`
          : 'Add photographs in the 3D Book tab — they stay on this device until you sign in.'}
      </Text>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {month != null
            ? `Month ${month} is open. Turn it into a story in Stories, or pick a keepsake idea in Ideas.`
            : 'Set a birth date on Today to personalize chapters and reminders.'}
        </Text>
        <Button
          label="Open Stories"
          onPress={() => router.push('/book/stories')}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/book/album')}
        style={styles.albumCta}
      >
        <Text style={styles.albumEyebrow}>Your 3D Album</Text>
        <Text style={styles.albumTitle}>A year you can hold</Text>
        <Text style={styles.albumMeta}>Turn pages · edit spreads</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>New in Yarn Trails</Text>
      <View style={styles.carousel}>
        {FEATURE_CAROUSEL.map((item) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            onPress={() => router.push(`/book/${item.tab}`)}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </Pressable>
        ))}
      </View>

      {!dob ? (
        <Link href="/birth" asChild>
          <Pressable style={styles.hintLink}>
            <Text style={styles.hint}>Add birth date on Today</Text>
          </Pressable>
        </Link>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space.screen,
    paddingBottom: 48,
    gap: 16,
  },
  eyebrow: {
    fontFamily: fonts.bodyStrong,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: bookColors.accent,
  },
  heroTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 32,
    lineHeight: 38,
    color: bookColors.text,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: bookColors.textMuted,
  },
  banner: {
    backgroundColor: bookColors.surface,
    borderWidth: 1,
    borderColor: bookColors.border,
    padding: 16,
    gap: 12,
  },
  bannerText: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: bookColors.textMuted,
  },
  albumCta: {
    backgroundColor: bookColors.surface,
    borderWidth: 1,
    borderColor: bookColors.border,
    padding: 18,
    gap: 4,
  },
  albumEyebrow: {
    fontFamily: fonts.bodyStrong,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: bookColors.sage,
  },
  albumTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 22,
    color: bookColors.text,
  },
  albumMeta: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: bookColors.textMuted,
  },
  sectionTitle: {
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    color: bookColors.text,
    marginTop: 8,
  },
  carousel: { gap: 10 },
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: bookColors.border,
    backgroundColor: bookColors.surface,
    gap: 6,
  },
  cardTitle: {
    fontFamily: fonts.bodyStrong,
    fontSize: 15,
    color: bookColors.text,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: bookColors.textMuted,
  },
  hintLink: { minHeight: space.target, justifyContent: 'center' },
  hint: {
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    color: colors.trail,
  },
});