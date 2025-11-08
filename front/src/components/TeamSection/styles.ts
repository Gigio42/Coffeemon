import { StyleSheet } from 'react-native';
import { metrics } from '../../theme';

export const styles = StyleSheet.create({
  teamSection: {
    width: '100%',
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#8B4513',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    textAlign: 'center',
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
    gap: 12,
  },
});
