import { StyleSheet } from 'react-native';
import { pixelArt } from '../../theme/pixelArt';
import { PIXEL_FONT } from '../CoffeemonCard/styles';

export const styles = StyleSheet.create({
  teamSection: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'center',
    maxWidth: 360,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    marginTop: -pixelArt.spacing.sm,
    marginBottom: -10,
    alignSelf: 'stretch',
    width: '100%',
  },

  sectionHeaderRowCompact: {
    marginBottom: pixelArt.spacing.sm,
  },

  sectionHeaderButton: {
    flex: 4,
    height: 60,
    paddingHorizontal: pixelArt.spacing.lg,
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: '#f7e6c8',
    borderLeftColor: '#f7e6c8',
    borderRightColor: '#bfa97b',
    borderBottomColor: '#bfa97b',
    backgroundColor: '#fff9f0',
    ...pixelArt.shadows.innerBorder,
    position: 'relative',
  },

  sectionHeaderButtonStatic: {
    pointerEvents: 'none',
  },

  sectionHeaderWithAction: {
    justifyContent: 'space-between',
  },

  sectionHeaderCentered: {
    justifyContent: 'center',
    width: '100%',
  },

  sectionTitle: {
    fontWeight: '900',
    fontSize: 11,
    color: '#8B4513',
    fontFamily: PIXEL_FONT,
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: '#f7e6c8',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  expandIcon: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8B4513',
    fontFamily: PIXEL_FONT,
    opacity: 0.9,
  },
  
  addButton: {
    backgroundColor: '#fff9f0',
    paddingHorizontal: pixelArt.spacing.md,
    paddingVertical: pixelArt.spacing.sm,
    borderRadius: pixelArt.borders.radiusSmall,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: '#f7e6c8',
    borderLeftColor: '#f7e6c8',
    borderBottomColor: '#bfa97b',
    borderRightColor: '#bfa97b',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#8B4513',
    fontFamily: PIXEL_FONT,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  qrButton: {
    flex: 1,
    height: 60,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff9f0',
    borderWidth: pixelArt.borders.widthBold,
    borderTopColor: '#f7e6c8',
    borderLeftColor: '#f7e6c8',
    borderRightColor: '#bfa97b',
    borderBottomColor: '#bfa97b',
    ...pixelArt.shadows.innerBorder,
    position: 'relative',
  },

  qrButtonDisabled: {
    opacity: 0.4,
  },

  qrIcon: {
    width: '100%',
    height: '100%',
  },

  qrLabel: {
    marginTop: pixelArt.spacing.xs,
    color: '#8B4513',
    fontFamily: PIXEL_FONT,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptyText: {
    fontSize: 13,
    color: '#8B4513',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 32,
    fontFamily: 'monospace',
    opacity: 0.7,
  },
  
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  carousel: {
    width: '100%',
    alignSelf: 'center',
  },
  
  carouselContent: {
    paddingHorizontal: 4,
    gap: 0,
    justifyContent: 'center',
  },
  
  availableGridContent: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingBottom: 300,
    alignItems: 'flex-start',
    flexGrow: 1,
    flexDirection: 'column',
  },

  availableGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    rowGap: 4,
    columnGap: 2,
    marginBottom: 0,
  },

  availableCardWrapper: {
    width: '33.33%', // 3 colunas ao invés de 2
    maxWidth: 88,
    height: 200,
    paddingHorizontal: 1,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  availableCardScaler: {
    transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }],
    width: '100%',
    alignItems: 'center',
  },

  grid: {
    width: '100%',
    maxHeight: 300, // Limit height for scroll
  },
  
  gridContent: {
    paddingVertical: 8,
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});
