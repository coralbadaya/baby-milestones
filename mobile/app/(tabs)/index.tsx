import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { JobLink } from '@/components/JobLink';
import { Body, Eyebrow, Screen, Title } from '@/components/Screen';
import { BRAND_NAME, BRAND_TAGLINE, PURPOSE } from '@/constants/brand';
import { colors, fonts } from '@/constants/theme';
import { JOBS, dailyLines } from '@/content/today';
import { readBirthDate } from '@/lib/birthDate';
import { monthAge, monthLabel } from '@/lib/monthAge';

export default function TodayScreen() {
  const [dob, setDob] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      readBirthDate()
        .then((value) => {
          if (alive) setDob(value);
        })
        .catch(() => {
          if (alive) setDob(null);
        });
      return () => {
        alive = false;
      };
    }, []),
  );

  const month = dob ? monthAge(new Date(), dob) : null;
  const lines = month == null ? null : dailyLines(month);

  return (
    <Screen>
      <Eyebrow>{BRAND_NAME}</Eyebrow>
      <Title>{BRAND_TAGLINE}</Title>
      <Body>{PURPOSE}</Body>

      <View style={styles.card}>
        {lines && month != null ? (
          <>
            <Text style={styles.month}>{monthLabel(month)}</Text>
            <Text style={styles.line}>{lines.baby}</Text>
            <Text style={styles.line}>{lines.mother}</Text>
          </>
        ) : (
          <>
            <Text style={styles.month}>This month</Text>
            <Text style={styles.line}>
              Set a birth date and Today will name the month you are in. That date is what brings you back.
            </Text>
          </>
        )}
      </View>

      <JobLink
        href="/birth"
        label={dob ? 'Birth date saved' : 'Set a birth date'}
        detail={dob || 'One date, on this phone'}
      />

      <View style={styles.jobs}>
        {JOBS.map((job) => (
          <JobLink
            key={job.href}
            href={job.href}
            label={job.label}
            detail={job.detail}
            accent={job.label === 'Plus'}
          />
        ))}
      </View>

      <JobLink href="/login" label="Sign in" detail="The same email code as the website" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.trailTint,
    borderRadius: 0,
    padding: 20,
    gap: 10,
  },
  month: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    color: colors.text,
  },
  line: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  jobs: { gap: 10 },
});
