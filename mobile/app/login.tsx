import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { DevAuthAssist } from '@/components/DevAuthAssist';
import { Body, Screen, Title } from '@/components/Screen';
import { TEST_USER, isMailinatorAddress } from '@/content/testCredentials';
import { colors, fonts, space } from '@/constants/theme';
import { fetchDevInboxOtp } from '@/lib/fetchDevInboxOtp';
import { supabase, supabaseConfigured } from '@/lib/supabase';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState(__DEV__ ? TEST_USER.email : '');
  const [password, setPassword] = useState(__DEV__ ? TEST_USER.password : '');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function signInWithPassword() {
    if (!EMAIL.test(email.trim())) {
      setNote('Enter the email you use for Yarn Trails.');
      return;
    }
    if (!password || password.length < 8) {
      setNote('Enter your password (8+ characters).');
      return;
    }
    if (!supabaseConfigured || !supabase) {
      setNote('Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to mobile/.env (same as web).');
      return;
    }
    setBusy(true);
    setNote('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      if (data.session) {
        router.replace('/(tabs)');
        return;
      }
      setStep('otp');
      setNote('Check your email for a code, or use Fill OTP from Mailinator.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed';
      if (/confirm|verified/i.test(message)) {
        setStep('otp');
        setNote('Email not verified yet. Enter the code or fetch from Mailinator.');
      } else {
        setNote(message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    const token = code.replace(/\D/g, '').slice(0, 6);
    if (token.length < 6) {
      setNote('Enter the 6-digit code from your email.');
      return;
    }
    if (!supabase) return;
    setBusy(true);
    setNote('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: 'signup',
      });
      if (error) throw error;
      if (data.session) router.replace('/(tabs)');
      else setNote('Verified. Sign in with your password.');
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Invalid or expired code.');
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    if (!supabase || !EMAIL.test(email.trim())) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
      if (error) throw error;
      setNote('A new code was sent.');
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not resend.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      footer={
        <View style={styles.actions}>
          {step === 'password' ? (
            <Button label={busy ? 'Signing in…' : 'Sign in'} onPress={signInWithPassword} />
          ) : (
            <>
              <Button label={busy ? 'Verifying…' : 'Verify code'} onPress={verifyOtp} />
              <Button label="Resend code" onPress={resendCode} tone="quiet" />
              <Button label="Back to password" onPress={() => setStep('password')} tone="quiet" />
            </>
          )}
        </View>
      }
    >
      <Title>One account.</Title>
      <Body>
        Same Supabase login as yarntrails.com. Seeded test users use password only — no OTP at login.
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

      {step === 'password' ? (
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          style={styles.input}
          accessibilityLabel="Password"
        />
      ) : (
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="6-digit code"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          accessibilityLabel="Email code"
        />
      )}

      {note ? <Text style={styles.note}>{note}</Text> : null}

      <DevAuthAssist
        email={email}
        onFillCredentials={(preset) => {
          setEmail(preset.email);
          setPassword(preset.password);
          setStep('password');
        }}
        onFillOtp={setCode}
        fetchOtp={isMailinatorAddress(email) ? fetchDevInboxOtp : undefined}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 10 },
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