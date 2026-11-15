import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { Button } from '@/components/Button';
import { Body, Screen, Title } from '@/components/Screen';
import { colors, fonts, space } from '@/constants/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [note, setNote] = useState('');

  function sendCode() {
    if (!EMAIL.test(email.trim())) {
      setNote('Enter the email you use for Yarn Trails.');
      return;
    }
    setStep('code');
    setNote('The code will come from the same Yarn Trails account as the website. Sending it is the next connection.');
  }

  function confirmCode() {
    if (code.trim().length < 6) {
      setNote('Enter the six-digit code from the email.');
      return;
    }
    setNote('This phone will accept that code once it is connected to your account. It does not sign you in yet.');
  }

  return (
    <Screen
      footer={
        <Button
          label={step === 'email' ? 'Email me a code' : 'Confirm the code'}
          onPress={step === 'email' ? sendCode : confirmCode}
        />
      }
    >
      <Title>One account.</Title>
      <Body>
        Use the email you already use on yarntrails.com. The app will ask for the same code. Sign in with Apple comes before any other social button.
      </Body>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        style={styles.input}
        accessibilityLabel="Email"
      />
      {step === 'code' ? (
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          accessibilityLabel="Email code"
        />
      ) : null}
      {note ? <Text style={styles.note}>{note}</Text> : null}
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
  note: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
