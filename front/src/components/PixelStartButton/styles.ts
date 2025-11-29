import { StyleSheet } from 'react-native';

import { pixelArt } from '../../theme/pixelArt';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: pixelArt.spacing.lg,
  },

  button: {
    position: 'relative',
    overflow: 'visible',
    backgroundColor: '#fff9f0',
    borderWidth: 4,
    borderTopColor: '#fff2d6',
    borderLeftColor: '#fff2d6',
    borderBottomColor: '#b79f6e',
    borderRightColor: '#b79f6e',
    paddingVertical: pixelArt.spacing.md,
    paddingHorizontal: pixelArt.spacing.xl,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    borderTopColor: '#f7e4be',
    borderLeftColor: '#f7e4be',
    borderBottomColor: '#a1824f',
    borderRightColor: '#a1824f',
  },

  buttonDisabled: {
    borderTopColor: '#f7e4be',
    borderLeftColor: '#f7e4be',
    borderBottomColor: '#b79f6e',
    borderRightColor: '#b79f6e',
  },

  shine: {
    position: 'absolute',
    top: 6,
    left: 8,
    right: 8,
    height: 8,
    backgroundColor: '#fff2d6',
    opacity: 0.85,
    pointerEvents: 'none',
  },

  shinePressed: {
    backgroundColor: '#ffe7c0',
  },

  shade: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    right: 8,
    height: 8,
    backgroundColor: '#b79f6e',
    opacity: 0.9,
    pointerEvents: 'none',
  },

  shadePressed: {
    backgroundColor: '#a1824f',
  },

  inset: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 2,
    borderTopColor: '#fff9f0',
    borderLeftColor: '#fff9f0',
    borderBottomColor: '#d4c5a0',
    borderRightColor: '#d4c5a0',
    pointerEvents: 'none',
  },

  insetPressed: {
    borderTopColor: '#fff2d6',
    borderLeftColor: '#fff2d6',
    borderBottomColor: '#b79f6e',
    borderRightColor: '#b79f6e',
  },

  pixel: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#d4c5a0',
    pointerEvents: 'none',
  },

  pixelPressed: {
    backgroundColor: '#b79f6e',
  },

  pixelTopLeft: {
    top: -4,
    left: -4,
  },

  pixelTopRight: {
    top: -4,
    right: -4,
  },

  pixelBottomLeft: {
    bottom: -4,
    left: -4,
  },

  pixelBottomRight: {
    bottom: -4,
    right: -4,
  },

  label: {
    ...pixelArt.typography.pixelTitle,
    fontSize: 22,
    letterSpacing: 4,
    color: '#8B4513',
  },

  labelPressed: {
    color: '#6d3410',
  },

  subtitle: {
    ...pixelArt.typography.pixelBody,
    fontSize: 11,
    color: '#8B4513',
    marginTop: pixelArt.spacing.xs,
    letterSpacing: 2,
  },

  subtitlePressed: {
    color: '#6d3410',
  },
});
