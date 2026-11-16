import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Newsreader_500Medium } from '@expo-google-fonts/newsreader/500Medium';
import { Newsreader_500Medium_Italic } from '@expo-google-fonts/newsreader/500Medium_Italic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Newsreader_500Medium,
    Newsreader_500Medium_Italic,
    Manrope_400Regular,
    Manrope_600SemiBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.trailDark,
        headerTitleStyle: { fontFamily: 'Manrope_600SemiBold', color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="birth" options={{ title: 'Birth date' }} />
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="plus" options={{ title: 'Plus' }} />
      <Stack.Screen name="book" options={{ headerShown: false }} />
      <Stack.Screen name="vaccination" options={{ title: 'Vaccination tracker' }} />
      <Stack.Screen name="guides" options={{ title: 'Guides & Articles' }} />
      <Stack.Screen name="progress" options={{ title: 'Progress' }} />
      <Stack.Screen name="shopping" options={{ title: 'Shopping' }} />
      <Stack.Screen name="travel" options={{ title: 'Travel' }} />
      <Stack.Screen name="mom-feed" options={{ title: 'Mom Feed' }} />
      <Stack.Screen name="recipes" options={{ title: 'Baby Recipes' }} />
      <Stack.Screen name="tips" options={{ title: 'Parenting Tips' }} />
    </Stack>
  );
}
