import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeModules,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { pixelArt } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SlidingBottomSheetSection = {
  key: string;
  title: string;
  content: React.ReactNode;
};

type SlidingBottomSheetProps = {
  visible: boolean;
  sections: SlidingBottomSheetSection[];
  onClose: () => void;
  maxHeightRatio?: number;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_MAX_HEIGHT_RATIO = 0.75;
const ANIMATION_DURATION = 260;

export default function SlidingBottomSheet({
  visible,
  sections,
  onClose,
  maxHeightRatio = DEFAULT_MAX_HEIGHT_RATIO,
  style,
}: SlidingBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(visible);
  const supportsNativeDriver = useMemo(() => !!NativeModules?.NativeAnimatedModule, []);

  const containerStyle = useMemo(
    () => [styles.container, { maxHeight: SCREEN_HEIGHT * maxHeightRatio }, style],
    [maxHeightRatio, style]
  );

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
    }
  }, [visible]);

  const animateTo = useCallback(
    (sheetValue: number, opacityValue: number, callback?: () => void) => {
      translateY.stopAnimation?.();
      backdropOpacity.stopAnimation?.();

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetValue,
          duration: ANIMATION_DURATION,
          easing: undefined,
          useNativeDriver: supportsNativeDriver,
        }),
        Animated.timing(backdropOpacity, {
          toValue: opacityValue,
          duration: ANIMATION_DURATION,
          easing: undefined,
          useNativeDriver: supportsNativeDriver,
        }),
      ]).start(({ finished }) => {
        if (finished && callback) {
          callback();
        }
      });
    },
    [backdropOpacity, supportsNativeDriver, translateY]
  );

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (visible) {
      animateTo(0, 0.4);
    } else {
      animateTo(SCREEN_HEIGHT, 0, () => setIsMounted(false));
    }
  }, [animateTo, isMounted, visible]);

  if (!isMounted) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <AnimatedPressable
        onPress={onClose}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      />

      <Animated.View style={[styles.sheetWrapper, { transform: [{ translateY }] }]}
        pointerEvents="box-none"
      >
        <View style={containerStyle}>
          <View style={styles.handle} />

          <ScrollView
            style={styles.sectionsScroll}
            contentContainerStyle={styles.sectionsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sections.map((section, index) => (
              <View
                key={section.key}
                style={[styles.section, index === sections.length - 1 && styles.sectionLast]}
              >
                {!!section.title && (
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderAccent} />
                    <View style={styles.sectionHeaderContent}>
                      <View style={styles.sectionHeaderBullet} />
                      <View style={styles.sectionHeaderLabelWrapper}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.sectionContent}>{section.content}</View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  sheetWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: pixelArt.spacing.lg,
    paddingBottom: pixelArt.spacing.lg,
    paddingTop: pixelArt.spacing.md,
  },
  container: {
    width: '100%',
    backgroundColor: pixelArt.colors.cardOuterBg,
    borderRadius: pixelArt.borders.radiusMedium,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderRightColor: pixelArt.colors.borderDark,
    borderBottomColor: pixelArt.colors.borderDark,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 64,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginBottom: pixelArt.spacing.md,
  },
  sectionsScroll: {
    maxHeight: '100%',
  },
  sectionsScrollContent: {
    paddingBottom: pixelArt.spacing.lg,
  },
  section: {
    borderBottomWidth: pixelArt.borders.widthThin,
    borderBottomColor: pixelArt.colors.borderDark,
    paddingHorizontal: pixelArt.spacing.lg,
    paddingBottom: pixelArt.spacing.lg,
  },
  sectionLast: {
    borderBottomWidth: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelArt.spacing.sm,
  },
  sectionHeaderAccent: {
    width: 4,
    height: '100%',
    backgroundColor: pixelArt.colors.coffeePrimary,
    marginRight: pixelArt.spacing.md,
  },
  sectionHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: pixelArt.colors.borderDark,
    marginRight: pixelArt.spacing.sm,
  },
  sectionHeaderLabelWrapper: {
    flex: 1,
  },
  sectionTitle: {
    ...pixelArt.typography.pixelSubtitle,
    fontFamily: pixelArt.typography.pixelSubtitle.fontFamily,
    color: pixelArt.colors.textDark,
    textTransform: 'uppercase',
  },
  sectionContent: {
    marginTop: pixelArt.spacing.sm,
  },
});
