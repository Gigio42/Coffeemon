import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNav, NavScreen } from '../../components/BottomNav';
import { ShopScreen } from '../Shop';
import { TeamScreen } from '../Team';
import { CatalogScreen } from '../Catalog';
import { FriendsScreen } from '../Friends';
import { BattleState } from '../../types';
import { Socket } from 'socket.io-client';

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
    backgroundColor: '#FFFFFF',
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
        return <ShopScreen />;
      case 'team':
        return <TeamScreen />;
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
      case 'friends':
        return <FriendsScreen />;
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
