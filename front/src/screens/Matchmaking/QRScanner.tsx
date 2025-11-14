import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { captureCoffeemonViaQr, type PlayerCoffeemon } from '../../api/coffeemonService';

interface QRScannerProps {
  visible: boolean;
  token: string;
  onClose: () => void;
  onSuccess: (captured: PlayerCoffeemon) => void;
}

const QR_CODE_REGEX = /^coffeemon:\/\/add\/(\d+)$/i;

export default function QRScanner({ visible, token, onClose, onSuccess }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setIsProcessing(false);
      (async () => {
        try {
          const response = await requestPermission();
          if (response?.status === 'granted') {
            setErrorMessage(null);
          } else {
            setErrorMessage('Precisamos de acesso à câmera para ler os QR codes.');
          }
        } catch (error) {
          setErrorMessage('Não foi possível solicitar permissão da câmera.');
        }
      })();
    }
  }, [requestPermission, visible]);

  const instructions = useMemo(
    () =>
      [
        'Aponte a câmera para o QR code do Coffeemon.',
        'Garanta boa iluminação e mantenha o código no centro.',
        'Ao capturar, o Coffeemon será adicionado aos disponíveis.',
      ],
    [],
  );

  const handleInvalidQr = useCallback(() => {
    Alert.alert('QR inválido', 'Use um QR code gerado pelo sistema Coffeemon.');
  }, []);

  const handleBarCodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (!visible || isProcessing) {
        return;
      }

      const trimmed = data?.trim() ?? '';
      const match = trimmed.match(QR_CODE_REGEX);

      if (!match) {
        handleInvalidQr();
        return;
      }

      const coffeemonId = Number.parseInt(match[1], 10);
      if (!Number.isFinite(coffeemonId)) {
        handleInvalidQr();
        return;
      }

      setIsProcessing(true);

      try {
        const captured = await captureCoffeemonViaQr(token, coffeemonId);
        Alert.alert(
          'Coffeemon capturado! ✅',
          `${captured.coffeemon.name} foi adicionado ao seu inventário.`,
        );
        onSuccess(captured);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Não foi possível capturar.';
        Alert.alert('Erro ao capturar', message);
      } finally {
        setTimeout(() => setIsProcessing(false), 750);
      }
    },
    [handleInvalidQr, isProcessing, onSuccess, token, visible],
  );

  const renderContent = () => {
    if (!visible) {
      return null;
    }

    if (!permission) {
      return (
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.permissionText}>Solicitando acesso à câmera…</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionDeniedTitle}>Permissão necessária</Text>
          <Text style={styles.permissionDeniedMessage}>
            {errorMessage || 'Não foi possível acessar a câmera do dispositivo.'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        <View style={styles.overlay}>
          <View style={styles.instructionBox}>
            {instructions.map((text) => (
              <Text key={text} style={styles.instructionText}>
                • {text}
              </Text>
            ))}
          </View>

          <View style={styles.framingBox}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.processingText}>Capturando…</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={isProcessing}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>{renderContent()}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  instructionBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  instructionText: {
    color: '#f4f4f4',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  framingBox: {
    width: '80%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: '#00FFC2',
    borderRadius: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  processingOverlay: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    marginTop: 16,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  permissionDeniedTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionDeniedMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
