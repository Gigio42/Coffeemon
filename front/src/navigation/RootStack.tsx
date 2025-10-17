import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuthStore } from '../state';

// Screens (serão criadas depois)
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { MainMenuNavigator } from './MainMenuStack';
import { BattleScreen } from '../features/battle/screens/BattleScreen';

/**
 * ========================================
 * ROOT STACK NAVIGATOR
 * ========================================
 * 
 * Navegador principal da aplicação
 * Gerencia autenticação e fluxo principal
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        // Auth Flow
        <Stack.Screen 
          name="Auth" 
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
      ) : (
        // Main Flow
        <>
          <Stack.Screen 
            name="MainMenu" 
            component={MainMenuNavigator}
            options={{ title: 'Coffeemon' }}
          />
          <Stack.Screen 
            name="Battle" 
            component={BattleScreen}
            options={{ 
              title: 'Batalha',
              gestureEnabled: false, // Não pode voltar durante batalha
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
