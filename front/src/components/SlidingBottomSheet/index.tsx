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
import { BlurView } from 'expo-blur';

import { pixelArt } from '../../theme';
import { PIXEL_FONT } from '../CoffeemonCard/styles';

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
      <BlurView intensity={50} style={StyleSheet.absoluteFill}>
        <AnimatedPressable
          onPress={onClose}
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </BlurView>

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
    backgroundColor: '#F5E6D3',
    borderRadius: pixelArt.borders.radiusMedium,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderBottomColor: '#8B7355',
    borderRightColor: '#8B7355',
    overflow: 'hidden',
    ...pixelArt.shadows.card,
  },
  handle: {
    alignSelf: 'center',
    width: 64,
    height: 6,
    borderRadius: pixelArt.borders.radiusSmall,
    backgroundColor: '#8B7355',
    marginBottom: pixelArt.spacing.md,
    borderWidth: pixelArt.borders.widthThin,
    borderTopColor: pixelArt.colors.borderLight,
    borderLeftColor: pixelArt.colors.borderLight,
    borderBottomColor: pixelArt.colors.borderDark,
    borderRightColor: pixelArt.colors.borderDark,
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
    paddingTop: pixelArt.spacing.sm,
  },
  sectionHeaderAccent: {
    width: 4,
    height: '100%',
    backgroundColor: '#D4C5A0',
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
    fontFamily: PIXEL_FONT,
    color: '#8B7355',
    textTransform: 'uppercase',
  },
  sectionContent: {
    marginTop: pixelArt.spacing.sm,
  },
});
