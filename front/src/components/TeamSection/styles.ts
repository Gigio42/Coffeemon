import { StyleSheet } from 'react-native';
import { metrics } from '../../theme';

export const styles = StyleSheet.create({
  teamSection: {
    width: '100%',
    marginBottom: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#8B4513',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
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
  },
  
  carouselContent: {
    paddingHorizontal: 4,
    gap: 2, // Reduzido para 2 para deixar cards mais juntos
  },
  
  availableCardWrapper: {
    transform: [{ scale: 0.6 }],
    marginHorizontal: -20, // Ajusta margem para aproximar mais os cards
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
