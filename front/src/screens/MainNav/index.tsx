import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Socket } from "socket.io-client";
import { BottomNav, NavScreen } from "../../components/BottomNav";
import { colors } from "../../theme/colors";
import { BattleState } from "../../types";
import { ShopScreen } from "../Shop";
import { TeamScreen } from "../Team";
import { SocialScreen } from "../Social";

interface MainNavProps {
  token: string | null;
  playerId: number;
  userId?: number;
  isGuest?: boolean;
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
  hidden: {
    display: "none",
  },
});

export const MainNavScreen: React.FC<MainNavProps> = ({
  token,
  playerId,
  userId,
  isGuest,
  onNavigateToLogin,
  onNavigateToBattle,
  onNavigateToEcommerce,
  MatchmakingScreen,
}) => {
  const [activeScreen, setActiveScreen] = useState<NavScreen>("battle");
  const [introShown, setIntroShown] = useState(false);
  // Rastreia quais telas já foram montadas (lazy mount + keep-alive)
  const [mounted, setMounted] = useState<Set<NavScreen>>(new Set(["battle"]));

  const handleNavigate = (screen: NavScreen) => {
    if (screen === "menu") {
      onNavigateToEcommerce();
      return;
    }
    setMounted((prev) => {
      if (prev.has(screen)) return prev;
      const next = new Set(prev);
      next.add(screen);
      return next;
    });
    setActiveScreen(screen);
  };

  const visible = (screen: NavScreen) =>
    activeScreen === screen ? styles.screenContainer : styles.hidden;

  return (
    <View style={styles.container}>
      {/* Batalha — montada por padrão */}
      <View style={visible("battle")}>
        <MatchmakingScreen
          token={token}
          playerId={playerId}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToBattle={onNavigateToBattle}
          skipIntro={introShown}
          onIntroFinish={() => setIntroShown(true)}
        />
      </View>

      {/* Catálogo — monta na primeira visita */}
      {mounted.has("catalog") && (
        <View style={visible("catalog")}>
          <ShopScreen token={token} />
        </View>
      )}

      {/* Equipe — monta na primeira visita */}
      {mounted.has("team") && (
        <View style={visible("team")}>
          <TeamScreen token={token} />
        </View>
      )}

      {/* Social — monta na primeira visita */}
      {mounted.has("social") && (
        <View style={visible("social")}>
          <SocialScreen
            token={token}
            playerId={playerId}
            userId={userId}
            isGuest={isGuest}
            onLogout={onNavigateToLogin}
          />
        </View>
      )}

      <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />
    </View>
  );
};
