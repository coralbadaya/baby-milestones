import { useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { Slot, SpreadPage, composeSpread } from '@/lib/pageLayouts';
import { FOLD_MS, MOBILE_INPUT, MOBILE_ROTATE_X, MOBILE_ROTATE_Y, planTurn } from '@/lib/bookEngine';

function Words({ page, light }: { page: SpreadPage; light?: boolean }) {
  return (
    <View style={styles.words}>
      <Text style={[styles.kicker, light && styles.light]}>{page.monthLabel}</Text>
      <View style={[styles.rule, light && styles.ruleLight]} />
      <Text style={[styles.heading, light && styles.light]}>{page.title}</Text>
      {page.caption ? <Text style={[styles.caption, light && styles.lightSoft]}>{page.caption}</Text> : null}
    </View>
  );
}

function PhotoFill({ page }: { page: SpreadPage }) {
  if (!page.uri) return <View style={styles.paper} />;
  return <Image source={{ uri: page.uri }} style={styles.photo} />;
}

export function PageFace({ slot }: { slot: Slot }) {
  if (slot.role === 'blank' || !slot.page) return <View style={styles.paper} />;
  if (slot.role === 'ending') {
    return (
      <View style={[styles.paper, styles.centered]}>
        <Text style={styles.kicker}>The close</Text>
        <Text style={styles.heading}>{slot.page.title}</Text>
        <Text style={styles.caption}>{slot.page.caption}</Text>
      </View>
    );
  }
  if (slot.role === 'story') {
    return (
      <View style={[styles.paper, styles.story]}>
        <Words page={slot.page} />
      </View>
    );
  }
  if (slot.role === 'chapter') {
    return (
      <View style={[styles.paper, styles.chapter]}>
        <Text style={styles.month}>{slot.page.monthLabel.replace('Month ', '')}</Text>
        <Words page={slot.page} />
      </View>
    );
  }
  if (slot.role === 'pair') {
    return (
      <View style={styles.paper}>
        <View style={styles.stack}>
          <PhotoFill page={slot.page} />
          {slot.extra ? <PhotoFill page={slot.extra} /> : <View style={styles.photo} />}
        </View>
        <Words page={slot.page} />
      </View>
    );
  }
  return (
    <View style={styles.paper}>
      <PhotoFill page={slot.page} />
      <View style={styles.overlay}>
        <Words page={slot.page} light />
      </View>
    </View>
  );
}

export function OpenBook({
  pages,
  index,
  onIndex,
}: {
  pages: SpreadPage[];
  index: number;
  onIndex: (index: number) => void;
}) {
  const turn = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);
  const [dest, setDest] = useState<number | null>(null);
  const spread = composeSpread(pages, index);
  const landing = composeSpread(pages, dest ?? index);
  const rotateY = turn.interpolate({
    inputRange: MOBILE_INPUT,
    outputRange: MOBILE_ROTATE_Y.map((deg) => `${deg}deg`),
  });
  const rotateX = turn.interpolate({
    inputRange: MOBILE_INPUT,
    outputRange: MOBILE_ROTATE_X.map((deg) => `${deg}deg`),
  });

  function go(next: number) {
    const plan = planTurn({
      busy: busy.current,
      index,
      next,
      pageCount: pages.length,
      reducedMotion: false,
      mode: 'mobile',
    });
    if (plan.action === 'ignore' || plan.action === 'show') return;
    if (plan.action === 'settle') {
      onIndex(next);
      return;
    }
    busy.current = true;
    setDest(next);
    turn.setValue(0);
    Animated.timing(turn, {
      toValue: 1,
      duration: FOLD_MS,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onIndex(next);
      turn.setValue(0);
      setDest(null);
      busy.current = false;
    });
  }

  const atEnd = index + spread.take >= pages.length;
  const atStart = index <= 0;

  return (
    <View>
      <View style={styles.stage}>
        <View style={styles.cover} />
        <View style={styles.leftPage}>
          <PageFace slot={spread.left} />
        </View>
        <View style={styles.rightPage}>
          <PageFace slot={dest == null ? spread.right : landing.right} />
        </View>
        <Animated.View
          style={[styles.leaf, { transform: [{ perspective: 1200 }, { rotateY }, { rotateX }] }]}
        >
          <View style={styles.front}>
            <PageFace slot={spread.right} />
          </View>
          <View style={styles.back}>
            <PageFace slot={dest == null ? spread.right : landing.left} />
          </View>
        </Animated.View>
        <View style={styles.gutter} pointerEvents="none" />
      </View>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          onPress={() => go(previousSafe(pages, index))}
          style={[styles.control, atStart && styles.controlOff]}
        >
          <Text style={styles.controlLabel}>Previous</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next page"
          onPress={() => go(Math.min(pages.length - 1, index + spread.take))}
          style={[styles.control, atEnd && styles.controlOff]}
        >
          <Text style={styles.controlLabel}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

function previousSafe(pages: SpreadPage[], index: number) {
  let cursor = 0;
  let prev = 0;
  let hops = 0;
  while (cursor < index && hops <= pages.length) {
    const spread = composeSpread(pages, cursor);
    const step = cursor + spread.take;
    if (step <= cursor || step >= pages.length) break;
    prev = cursor;
    cursor = step;
    hops += 1;
    if (cursor === index) return prev;
  }
  return prev;
}

const styles = StyleSheet.create({
  stage: {
    height: 250,
    borderRadius: 8,
    backgroundColor: colors.trailDark,
    padding: 8,
  },
  cover: {
    ...StyleSheet.absoluteFill,
    borderRadius: 8,
    backgroundColor: colors.trailDark,
  },
  leftPage: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 8,
    width: '46%',
    overflow: 'hidden',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: colors.paper,
  },
  rightPage: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    right: 8,
    width: '46%',
    overflow: 'hidden',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.paper,
  },
  leaf: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    right: 8,
    width: '46%',
  },
  front: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  back: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
    transform: [{ rotateY: '180deg' }],
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  gutter: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: '50%',
    width: 14,
    marginLeft: -7,
    backgroundColor: 'rgba(47,74,64,0.2)',
  },
  paper: { flex: 1, backgroundColor: colors.paper },
  photo: { flex: 1, width: '100%', backgroundColor: colors.flax },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 18,
    backgroundColor: 'rgba(47,74,64,0.72)',
  },
  story: { justifyContent: 'center', padding: 8 },
  chapter: { justifyContent: 'flex-end', padding: 8 },
  centered: { justifyContent: 'center', padding: 10 },
  stack: { flex: 1, gap: 4, padding: 4 },
  words: { paddingHorizontal: 8, paddingVertical: 6 },
  kicker: {
    fontFamily: fonts.bodyStrong,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.trail,
  },
  rule: { width: 28, height: 1, backgroundColor: colors.gold, marginVertical: 3 },
  ruleLight: { backgroundColor: 'rgba(245,240,235,0.7)' },
  heading: {
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    lineHeight: 19,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  light: { color: colors.cream },
  lightSoft: { color: 'rgba(243,245,242,0.86)' },
  month: {
    fontFamily: fonts.displayItalic,
    fontSize: 54,
    lineHeight: 56,
    color: 'rgba(63,94,82,0.28)',
    paddingHorizontal: 8,
  },
  controls: { flexDirection: 'row', gap: 10, marginTop: 12 },
  control: {
    flex: 1,
    minHeight: 56,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.trail,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOff: { opacity: 0.35 },
  controlLabel: { fontFamily: fonts.bodyStrong, fontSize: 16, color: colors.trailDark },
});
