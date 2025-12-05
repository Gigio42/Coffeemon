import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Socket } from "socket.io-client";
import { BottomNav, NavScreen } from "../../components/BottomNav";
import { colors } from "../../theme/colors";
import { BattleState } from "../../types";
import { CatalogScreen } from "../Catalog";
import { ShopScreen } from "../Shop";
import { TeamScreen } from "../Team";

interface MainNavProps {
  token: string | null;
  playerId: number;
  onNavigateToLogin: () => void;
  onNavigateToBattle: (
    battleId: string,
    battleState: BattleState,
    socket: Socket
  ) => void;
  onNavigateToEcommerce: () => void;
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
  onNavigateToEcommerce,
  MatchmakingScreen,
}) => {
  const [activeScreen, setActiveScreen] = useState<NavScreen>("battle");
  const [introShown, setIntroShown] = useState(false);

  const handleNavigate = (screen: NavScreen) => {
    if (screen === "cafe") {
      onNavigateToEcommerce();
    } else {
      setActiveScreen(screen);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "shop":
        return <ShopScreen token={token} />;
      case "team":
        return <TeamScreen token={token} />;
      case "battle":
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
      case "catalog":
        return <CatalogScreen token={token} />;
      default:
        return <ShopScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />
    </View>
  );
};
