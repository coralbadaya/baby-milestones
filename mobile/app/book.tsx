import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { OpenBook } from '@/components/OpenBook';
import { colors, fonts, space } from '@/constants/theme';
import { PAGE_LAYOUTS, SpreadPage, composeSpread } from '@/lib/pageLayouts';
import { readBirthDate } from '@/lib/birthDate';
import {
  StoredPhoto,
  addPhotoUris,
  photoUri,
  pickFromLibrary,
  readPhotos,
  removePhoto,
  takePhoto,
  updatePhoto,
} from '@/lib/localBook';
import { monthAge, monthLabel } from '@/lib/monthAge';

function pagesFrom(photos: StoredPhoto[], dob: string | null): SpreadPage[] {
  const pages: SpreadPage[] = photos.map((photo) => {
    const month = dob ? monthAge(new Date(photo.addedAt), dob) : null;
    return {
      uri: photoUri(photo.fileName),
      monthLabel: month == null ? 'A page' : monthLabel(month),
      title: photo.title || 'A photograph',
      caption: photo.caption,
      when: '',
      layout: photo.layout,
    };
  });
  if (pages.length) {
    pages.push({
      ending: true,
      uri: '',
      monthLabel: 'The close',
      title: 'This chapter',
      caption: `${photos.length} ${photos.length === 1 ? 'photograph' : 'photographs'} on this phone.`,
      when: '',
      layout: 'chapter',
    });
  }
  return pages;
}

export default function BookScreen() {
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [dob, setDob] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState('');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all([readPhotos(), readBirthDate()])
        .then(([stored, birth]) => {
          if (!alive) return;
          setPhotos(stored);
          setDob(birth);
        })
        .catch(() => {
          if (alive) setNotice('The book on this phone could not be opened.');
        });
      return () => {
        alive = false;
      };
    }, []),
  );

  const pages = pagesFrom(photos, dob);
  const safeIndex = Math.min(index, Math.max(0, pages.length - 1));
  const current = photos[safeIndex];
  const spread = pages.length ? composeSpread(pages, safeIndex) : null;

  async function add(camera: boolean) {
    setNotice('');
    const picked = camera ? await takePhoto() : await pickFromLibrary();
    if (!picked.granted) {
      setNotice('Photo access is off. Allow it in Settings. The pages stay on this phone.');
      return;
    }
    if (!picked.uris.length) return;
    const stored = await addPhotoUris(picked.uris);
    setPhotos(stored);
    setIndex(Math.max(0, stored.length - picked.uris.length));
  }

  return (
    <View style={styles.fill}>
      {pages.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.stage}>
            <View style={styles.leftPage} />
            <View style={styles.rightPage}>
              <Text style={styles.emptyTitle}>The first page is a photograph.</Text>
            </View>
            <View style={styles.gutter} />
          </View>
          <Button label="Add photographs" onPress={() => add(false)} />
          <Pressable accessibilityRole="button" onPress={() => add(true)} style={styles.quiet}>
            <Text style={styles.quietLabel}>Take a photograph</Text>
          </Pressable>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.filled}>
          <OpenBook pages={pages} index={safeIndex} onIndex={setIndex} />
          {spread ? (
            <Text style={styles.count}>
              {safeIndex + 1}
              {spread.take > 1 ? `–${Math.min(pages.length, safeIndex + spread.take)}` : ''} of {photos.length}
            </Text>
          ) : null}

          {current ? (
            <>
              <View style={styles.layouts}>
                {PAGE_LAYOUTS.map((layout) => {
                  const on = (current.layout || 'photo-story') === layout.id;
                  return (
                    <Pressable
                      key={layout.id}
                      accessibilityRole="button"
                      onPress={() => updatePhoto(current.id, { layout: layout.id }).then(setPhotos)}
                      style={[styles.chip, on && styles.chipOn]}
                    >
                      <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{layout.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                value={current.title}
                onChangeText={(title) => {
                  setPhotos((list) => list.map((photo) => (photo.id === current.id ? { ...photo, title } : photo)));
                }}
                onEndEditing={(event) => updatePhoto(current.id, { title: event.nativeEvent.text })}
                placeholder="Title"
                placeholderTextColor={colors.textLight}
                style={styles.input}
              />
              <TextInput
                value={current.caption}
                onChangeText={(caption) => {
                  setPhotos((list) => list.map((photo) => (photo.id === current.id ? { ...photo, caption } : photo)));
                }}
                onEndEditing={(event) => updatePhoto(current.id, { caption: event.nativeEvent.text })}
                placeholder="The line on this page"
                placeholderTextColor={colors.textLight}
                style={[styles.input, styles.caption]}
                multiline
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  removePhoto(current.id).then((stored) => {
                    setPhotos(stored);
                    setIndex(0);
                  });
                }}
                style={styles.quiet}
              >
                <Text style={styles.quietLabel}>Remove this photograph</Text>
              </Pressable>
            </>
          ) : null}

          <Button label="Add photographs" onPress={() => add(false)} />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, width: '100%', backgroundColor: colors.cream },
  empty: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: space.screen,
    paddingTop: 8,
    gap: 20,
  },
  stage: {
    width: '100%',
    height: 320,
    borderRadius: 8,
    backgroundColor: colors.trailDark,
    padding: 10,
    flexDirection: 'row',
  },
  leftPage: {
    flex: 1,
    backgroundColor: colors.paper,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  rightPage: {
    flex: 1,
    backgroundColor: colors.paper,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    justifyContent: 'flex-end',
    paddingTop: 20,
    paddingBottom: 22,
    paddingLeft: 22,
    paddingRight: 16,
  },
  gutter: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: '50%',
    width: 14,
    marginLeft: -7,
    backgroundColor: 'rgba(47,74,64,0.18)',
  },
  emptyTitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
  },
  filled: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: space.screen,
    gap: 16,
    paddingBottom: 40,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  layouts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 56,
    paddingHorizontal: 14,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: colors.trail, borderColor: colors.trail },
  chipLabel: { fontFamily: fonts.bodyStrong, fontSize: 14, color: colors.trailDark },
  chipLabelOn: { color: colors.white },
  input: {
    minHeight: 56,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
  },
  caption: { minHeight: 88, paddingTop: 16, textAlignVertical: 'top' },
  quiet: { minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  quietLabel: { fontFamily: fonts.bodyStrong, fontSize: 16, color: colors.trail },
  notice: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.error, textAlign: 'center' },
});
