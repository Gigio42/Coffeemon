import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './navigation';

/**
 * ========================================
 * APP - ENTRY POINT
 * ========================================
 * 
 * Componente raiz da aplicação
 * Usa nova arquitetura com React Navigation
 */

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
