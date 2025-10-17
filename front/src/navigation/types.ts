import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BattleState } from '../types';

/**
 * ========================================
 * NAVIGATION TYPES
 * ========================================
 * 
 * Tipos para React Navigation
 * Define parâmetros de cada rota
 */

// Root Stack (principal)
export type RootStackParamList = {
  Auth: undefined;
  MainMenu: undefined;
  Battle: {
    battleId: string;
    battleState: BattleState;
  };
};

// Main Menu Stack (nested)
export type MainMenuStackParamList = {
  Matchmaking: undefined;
  Ecommerce: undefined;
  Profile: undefined;
};

// Navigation Props
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainMenuStackNavigationProp = NativeStackNavigationProp<MainMenuStackParamList>;

// Route Props
export type BattleScreenRouteProp = RouteProp<RootStackParamList, 'Battle'>;

// Helper types
export type NavigationProp = RootStackNavigationProp | MainMenuStackNavigationProp;
