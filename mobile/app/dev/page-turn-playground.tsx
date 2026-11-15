import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { OpenBook } from '@/components/OpenBook';
import { colors, fonts, space } from '@/constants/theme';
import { FOLD_MS, MOBILE_INPUT, MOBILE_ROTATE_X, MOBILE_ROTATE_Y, planTurn } from '@/lib/bookEngine';
import type { SpreadPage } from '@/lib/pageLayouts';

const QA_PAGES: SpreadPage[] = [
  {
    uri: '',
    monthLabel: 'QA A',
    title: 'Mobile forward',
    caption: 'Native driver, cubic in-out, 1900ms.',
    when: '',
    layout: 'photo-story',
  },
  {
    uri: '',
    monthLabel: 'QA B',
    title: 'Mobile back',
    caption: 'Second spread for backward test.',
    when: '',
    layout: 'story-photo',
  },
  {
    ending: true,
    uri: '',
    monthLabel: 'End',
    title: 'Boundary',
    caption: 'Last spread.',
    when: '',
    layout: 'chapter',
  },
];

export default function DevPageTurnPlayground() {
  const [index, setIndex] = useState(0);
  const plan = planTurn({
    busy: false,
    index,
    next: index + 1,
    pageCount: QA_PAGES.length,
    reducedMotion: false,
    mode: 'mobile',
  });

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.kicker}>Development only</Text>
      <Text style={styles.title}>Page turn QA · mobile</Text>
      <Text style={styles.body}>
        Uses the real OpenBook component. Y/X stops come from bookEngine.ts, kept in sync with src/book/engine via
        mobileEngineSync.test.js.
      </Text>
      <View style={styles.meta}>
        <Text style={styles.metaLine}>FOLD_MS: {FOLD_MS}</Text>
        {MOBILE_INPUT.map((t, i) => (
          <Text key={t} style={styles.metaLine}>
            {`t=${t} → Y ${MOBILE_ROTATE_Y[i]}° X ${MOBILE_ROTATE_X[i]}°`}
          </Text>
        ))}
        <Text style={styles.metaLine}>
          plan next: {plan.action} {plan.action === 'animate' ? `to ${'next' in plan ? plan.next : ''}` : ''}
        </Text>
      </View>
      <OpenBook pages={QA_PAGES} index={index} onIndex={setIndex} />
      <Text style={styles.hint}>Run on a device for native-driver FPS checks. Web export does not equal iOS/Android.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.screen, gap: space.stack },
  kicker: {
    fontFamily: fonts.bodyStrong,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.trail,
  },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  meta: {
    padding: space.stack,
    borderWidth: 1,
    borderColor: colors.trail,
    gap: 2,
  },
  metaLine: { fontFamily: fonts.body, fontSize: 12, color: colors.text },
  hint: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary, marginTop: space.screen },
});