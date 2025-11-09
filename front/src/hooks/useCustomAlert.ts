import { useState, useCallback } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertConfig {
  type: AlertType;
  title: string;
  message: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface AlertState extends AlertConfig {
  visible: boolean;
}

export function useCustomAlert() {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    showCancel: false,
  });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertState({
      ...config,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, visible: false }));
  }, []);

  // Atalhos para tipos comuns
  const showSuccess = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ type: 'success', title, message, onConfirm });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ type: 'error', title, message, onConfirm });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ type: 'warning', title, message, onConfirm });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      showAlert({ type: 'info', title, message, onConfirm });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText = 'Confirmar',
      cancelText = 'Cancelar'
    ) => {
      showAlert({
        type: 'warning',
        title,
        message,
        showCancel: true,
        onConfirm,
        confirmText,
        cancelText,
      });
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
}
