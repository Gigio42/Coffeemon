import { StyleSheet } from 'react-native';
import { metrics } from '../../theme';

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

  sectionHeaderWithAction: {
    justifyContent: 'space-between',
  },

  sectionHeaderCentered: {
    justifyContent: 'center',
    width: '100%',
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f8e7c0',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  expandIcon: {
    marginLeft: 8,
    fontSize: 14,
    color: '#f8e7c0',
    fontFamily: 'monospace',
    opacity: 0.9,
  },
  
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  
  availableCardWrapper: {
    transform: [{ scale: 0.68 }],
    marginHorizontal: -16, // Aproxima ainda mais os cards
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
