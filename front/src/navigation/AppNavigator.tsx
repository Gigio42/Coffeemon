import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackNavigator } from './RootStack';

/**
 * ========================================
 * APP NAVIGATOR
 * ========================================
 * 
 * Container principal de navegação
 * Envolve toda a aplicação
 */

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
};
