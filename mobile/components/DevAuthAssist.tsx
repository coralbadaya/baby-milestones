import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TEST_ADMIN, TEST_USER } from '@/content/testCredentials';
import { colors, fonts } from '@/constants/theme';

type CredentialPreset = {
  email: string;
  password: string;
  displayName?: string;
  label: string;
};

export function DevAuthAssist({
  email = '',
  onFillCredentials,
  onFillOtp,
  fetchOtp,
}: {
  email?: string;
  onFillCredentials?: (preset: CredentialPreset) => void;
  onFillOtp?: (otp: string) => void;
  fetchOtp?: (email: string) => Promise<string>;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  if (!__DEV__) return null;

  const pullOtp = async () => {
    const target = email.trim();
    if (!target || !fetchOtp) {
      setNote('Use a @mailinator.com email, send the code, then tap Fill OTP.');
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const otp = await fetchOtp(target);
      onFillOtp?.(otp);
      setNote(`Filled code ${otp} from Mailinator.`);
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not fetch OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Dev shortcuts</Text>
      <View style={styles.row}>
        {onFillCredentials ? (
          <>
            <Pressable style={styles.chip} onPress={() => onFillCredentials(TEST_USER)}>
              <Text style={styles.chipText}>{TEST_USER.label}</Text>
            </Pressable>
            <Pressable style={styles.chip} onPress={() => onFillCredentials(TEST_ADMIN)}>
              <Text style={styles.chipText}>{TEST_ADMIN.label}</Text>
            </Pressable>
          </>
        ) : null}
        {onFillOtp && fetchOtp ? (
          <Pressable style={styles.chip} onPress={pullOtp} disabled={busy}>
            <Text style={styles.chipText}>{busy ? 'Fetching…' : 'Fill OTP from Mailinator'}</Text>
          </Pressable>
        ) : null}
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    gap: 8,
  },
  label: {
    fontFamily: fonts.bodyStrong,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 40,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipText: { fontFamily: fonts.bodyStrong, fontSize: 13, color: colors.trailDark },
  note: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
});