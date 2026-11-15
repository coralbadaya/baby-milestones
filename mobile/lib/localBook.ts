import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const KEY = 'yarntrailsBook';

export type StoredPhoto = {
  id: string;
  fileName: string;
  title: string;
  caption: string;
  addedAt: string;
  layout?: string;
};

type Store = { photos: StoredPhoto[] };

function folder() {
  const dir = new Directory(Paths.document, 'yarntrails-book');
  if (!dir.exists) dir.create();
  return dir;
}

export function photoUri(fileName: string) {
  return new File(folder(), fileName).uri;
}

async function readStore(): Promise<Store> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { photos: [] };
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || !Array.isArray(parsed.photos)) return { photos: [] };
    return parsed;
  } catch {
    return { photos: [] };
  }
}

async function writeStore(store: Store) {
  await AsyncStorage.setItem(KEY, JSON.stringify(store));
}

export async function readPhotos() {
  const store = await readStore();
  return store.photos.filter((photo) => new File(folder(), photo.fileName).exists);
}

async function copyIntoBook(uri: string, fileName: string) {
  const dest = new File(folder(), fileName);
  await new File(uri).copy(dest);
}

export async function addPhotoUris(uris: string[]) {
  const store = await readStore();
  for (const uri of uris) {
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${id}.jpg`;
    await copyIntoBook(uri, fileName);
    store.photos.push({
      id,
      fileName,
      title: 'A photograph',
      caption: '',
      addedAt: new Date().toISOString(),
    });
  }
  await writeStore(store);
  return readPhotos();
}

export async function updatePhoto(id: string, patch: Partial<Pick<StoredPhoto, 'title' | 'caption' | 'layout'>>) {
  const store = await readStore();
  store.photos = store.photos.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo));
  await writeStore(store);
  return readPhotos();
}

export async function removePhoto(id: string) {
  const store = await readStore();
  const found = store.photos.find((photo) => photo.id === id);
  store.photos = store.photos.filter((photo) => photo.id !== id);
  await writeStore(store);
  if (found) {
    const file = new File(folder(), found.fileName);
    if (file.exists) file.delete();
  }
  return readPhotos();
}

async function chosenUris(camera: boolean) {
  const permission = camera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return { granted: false as const, uris: [] as string[] };
  const result = camera
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsMultipleSelection: true,
        selectionLimit: 12,
      });
  if (result.canceled || !result.assets) return { granted: true as const, uris: [] as string[] };
  return { granted: true as const, uris: result.assets.map((asset) => asset.uri) };
}

export async function pickFromLibrary() {
  return chosenUris(false);
}

export async function takePhoto() {
  return chosenUris(true);
}
