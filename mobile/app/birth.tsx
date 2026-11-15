import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { Button } from '@/components/Button';
import { Body, Screen, Title } from '@/components/Screen';
import { colors, fonts, space } from '@/constants/theme';
import { writeBirthDate } from '@/lib/birthDate';
import { isBirthDate } from '@/lib/monthAge';

export default function BirthScreen() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  async function save() {
    const next = value.trim();
    if (!isBirthDate(next)) {
      setError('Use the form YYYY-MM-DD, a real calendar day.');
      return;
    }
    await writeBirthDate(next);
    router.back();
  }

  return (
    <Screen
      footer={<Button label="Save on this phone" onPress={save} />}
    >
      <Title>When were they born?</Title>
      <Body>
        Today counts months from this date. It stays on this phone until sign-in can keep it with your account.
      </Body>
      <TextInput
        value={value}
        onChangeText={(text) => {
          setValue(text);
          setError('');
        }}
        placeholder="2026-01-22"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        style={styles.input}
        accessibilityLabel="Birth date"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: space.target,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.text,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.error,
  },
});
