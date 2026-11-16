import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

import { bookColors } from '@/constants/babyBookTheme';

type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
};

function StarLayer({ count = 72 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );
  const tick = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let reduced = false;
    let loop: Animated.CompositeAnimation | null = null;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reduced = enabled;
      if (reduced) {
        tick.setValue(1);
        return;
      }
      loop = Animated.loop(
        Animated.timing(tick, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loop.start();
    });

    return () => loop?.stop();
  }, [tick]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((star, i) => {
        const opacity = tick.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [
            0.25 + 0.35 * Math.sin(star.phase),
            0.45 + 0.4 * Math.sin(star.phase + 1),
            0.3 + 0.5 * Math.sin(star.phase + 2),
            0.5 + 0.35 * Math.sin(star.phase + 3),
            0.25 + 0.35 * Math.sin(star.phase + 4),
          ],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.star,
              {
                opacity,
                width: star.size,
                height: star.size,
                borderRadius: star.size,
                left: `${star.x * 100}%`,
                top: `${star.y * 100}%`,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/** Twilight gradient + soft starfield (web StarfieldCanvas). */
export function BabyBookBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" accessibilityElementsHidden>
      <LinearGradient
        colors={['#1a1432', '#2d1f4e', '#1e1638', '#0f0a1a']}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', bookColors.accentSoft, 'transparent']}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.8 }}
        style={[StyleSheet.absoluteFill, styles.goldWash]}
      />
      <StarLayer />
    </View>
  );
}

const styles = StyleSheet.create({
  goldWash: { opacity: 0.35 },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(245, 240, 235, 0.95)',
  },
});