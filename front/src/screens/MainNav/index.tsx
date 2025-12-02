import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNav, NavScreen } from '../../components/BottomNav';
import { ShopScreen } from '../Shop';
import { TeamScreen } from '../Team';
import { CatalogScreen } from '../Catalog';
import EcommerceScreen from '../Ecommerce';
import { BattleState } from '../../types';
import { Socket } from 'socket.io-client';
import { colors } from '../../theme/colors';

interface MainNavProps {
  token: string | null;
  playerId: number;
  onNavigateToLogin: () => void;
  onNavigateToBattle: (battleId: string, battleState: BattleState, socket: Socket) => void;
  MatchmakingScreen: React.ComponentType<any>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  screenContainer: {
    flex: 1,
  },
});

export const MainNavScreen: React.FC<MainNavProps> = ({
  token,
  playerId,
  onNavigateToLogin,
  onNavigateToBattle,
  MatchmakingScreen,
}) => {
  const [activeScreen, setActiveScreen] = useState<NavScreen>('battle');
  const [introShown, setIntroShown] = useState(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'shop':
        return <ShopScreen token={token} />;
      case 'team':
        return <TeamScreen token={token} />;
      case 'battle':
        return (
          <MatchmakingScreen
            token={token}
            playerId={playerId}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToBattle={onNavigateToBattle}
            skipIntro={introShown}
            onIntroFinish={() => setIntroShown(true)}
          />
        );
      case 'catalog':
        return <CatalogScreen token={token} />;
      case 'cafe':
        return <EcommerceScreen token={token || ''} userId={playerId} onNavigateToMatchmaking={() => setActiveScreen('battle')} onLogout={onNavigateToLogin} />;
      default:
        return <ShopScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </View>
  );
};
