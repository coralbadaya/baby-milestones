import AsyncStorage from '@react-native-async-storage/async-storage';

/** Same key the website keeps in local storage. */
export const BIRTH_DATE_KEY = 'babyBirthDate';

export async function readBirthDate(): Promise<string | null> {
  const value = await AsyncStorage.getItem(BIRTH_DATE_KEY);
  return value || null;
}

export async function writeBirthDate(value: string): Promise<void> {
  await AsyncStorage.setItem(BIRTH_DATE_KEY, value);
}
