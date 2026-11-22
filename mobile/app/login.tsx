import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { DevAuthAssist } from '@/components/DevAuthAssist';
import { Body, Screen, Title } from '@/components/Screen';
import { CONTACT_EMAIL, SITE_URL } from '@/constants/brand';
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

  async function confirmEmail(trimmed: string) {
    const origin = process.env.EXPO_PUBLIC_SITE_URL || SITE_URL;
    const res = await fetch(`${origin}/api/auth-confirm-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed, password }),
    });
    if (!res.ok) throw new Error('Could not open this account yet.');
  }

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
    const trimmed = email.trim();
    try {
      const first = await supabase.auth.signInWithPassword({ email: trimmed, password });
      if (!first.error && first.data.session) {
        router.replace('/(tabs)');
        return;
      }
      const message = first.error?.message || '';
      if (/not confirmed/i.test(message)) {
        await confirmEmail(trimmed);
        const retry = await supabase.auth.signInWithPassword({ email: trimmed, password });
        if (retry.error) throw retry.error;
        if (retry.data.session) {
          router.replace('/(tabs)');
          return;
        }
      } else if (/invalid login|invalid credentials/i.test(message) || first.error) {
        if (first.error && !/invalid login|invalid credentials/i.test(message) && !/not confirmed/i.test(message)) {
          throw first.error;
        }
        const signedUp = await supabase.auth.signUp({ email: trimmed, password });
        if (signedUp.error) throw signedUp.error;
        if (signedUp.data.session) {
          router.replace('/(tabs)');
          return;
        }
        try {
          await confirmEmail(trimmed);
          const after = await supabase.auth.signInWithPassword({ email: trimmed, password });
          if (after.error) throw after.error;
          if (after.data.session) {
            router.replace('/(tabs)');
            return;
          }
        } catch {
          setStep('otp');
          setNote('Account created. You can enter the email code now, or later.');
          return;
        }
      }
      setStep('otp');
      setNote('You can enter the email code now, or later.');
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Sign-in failed');
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
            <Button label={busy ? 'Please wait…' : 'Continue'} onPress={signInWithPassword} />
          ) : (
            <>
              <Button label={busy ? 'Verifying…' : 'Verify code'} onPress={verifyOtp} />
              <Button label="Resend code" onPress={resendCode} tone="quiet" />
              <Button label="Skip for now" onPress={() => setStep('password')} tone="quiet" />
            </>
          )}
        </View>
      }
    >
      <Title>One account.</Title>
      <Body>
        Sign in or create an account with the same email as yarntrails.com. The code is optional verification.
      </Body>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={CONTACT_EMAIL}
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