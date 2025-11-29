import { StyleSheet } from 'react-native';
import { pixelArt } from '../../theme/pixelArt';

export const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 4,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Courier New',
  },
  level: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Courier New',
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: '100%',
    overflow: 'hidden',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 180,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#EEE',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#333', // Will be overridden by dynamic color
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
    fontFamily: 'Courier New',
  },
  tabTextActive: {
    color: '#333', // Will be overridden by dynamic color
  },
  tabContent: {
    padding: 16,
    height: 300, // Fixed height for scrollable content
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Courier New',
    borderBottomWidth: 2,
    borderBottomColor: '#EEE',
    paddingBottom: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    fontFamily: 'Courier New',
  },
  statBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#EEE',
    borderRadius: 6,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 6,
  },
  statValue: {
    width: 30,
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
    fontFamily: 'Courier New',
  },
  xpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  xpLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Courier New',
  },
  xpValue: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },
  moveCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  moveName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Courier New',
  },
  moveType: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Courier New',
    textTransform: 'uppercase',
  },
  moveDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'Courier New',
  },
  moveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moveStat: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Courier New',
  },
  noMoves: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Courier New',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
  },
  
  // Swap Selection Styles
  swapContainer: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  swapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Courier New',
    marginBottom: 8,
  },
  swapSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Courier New',
    marginBottom: 20,
  },
  swapList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  swapItem: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    width: '30%',
  },
  swapImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  swapName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Courier New',
    textAlign: 'center',
  },
  swapLevel: {
    fontSize: 9,
    color: '#666',
    fontFamily: 'Courier New',
  },
  cancelSwapButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelSwapText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Courier New',
    textDecorationLine: 'underline',
  },
});
