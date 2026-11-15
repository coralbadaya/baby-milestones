/**
 * Numeric pose as React Native transform entries.
 * The phone screen does not call this every frame. Animated interpolates the
 * same stops on the native driver, which keeps the turn off the React render path.
 */
export function mobileTransform(pose) {
  return [
    { perspective: 1200 },
    { rotateY: pose.rotateY + 'deg' },
    { rotateX: pose.rotateX + 'deg' },
  ];
}
