import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainMenuStackParamList } from './types';

// Screens (serão criadas depois)
import { MatchmakingScreen } from '../features/matchmaking/screens/MatchmakingScreen';
import { EcommerceScreen } from '../features/ecommerce/screens/EcommerceScreen';

/**
 * ========================================
 * MAIN MENU STACK NAVIGATOR
 * ========================================
 * 
 * Navegador do menu principal
 * Gerencia telas após login
 */

const Stack = createNativeStackNavigator<MainMenuStackParamList>();

export const MainMenuNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Matchmaking"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2ecc71',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Matchmaking" 
        component={MatchmakingScreen}
        options={{ title: 'Coffeemon - Matchmaking' }}
      />
      <Stack.Screen 
        name="Ecommerce" 
        component={EcommerceScreen}
        options={{ title: 'Loja' }}
      />
    </Stack.Navigator>
  );
};
