import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { getServerUrl } from '../utils/config';

interface QRScannerProps {
  visible: boolean;
  token: string;
  onClose: () => void;
  onCoffeemonAdded: () => void;
}

export default function QRScanner({
  visible,
  token,
  onClose,
  onCoffeemonAdded,
}: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (visible) {
      requestCameraPermission();
    }
  }, [visible]);

  async function requestCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned || processing) return;

    setScanned(true);
    setProcessing(true);

    console.log('QR Code scanned:', data);

    try {
      // Formato esperado: coffeemon://add/1 ou coffeemon://add/2
      if (!data.startsWith('coffeemon://add/')) {
        Alert.alert(
          'QR Code Inválido',
          'Este QR code não é de um Coffeemon válido.'
        );
        resetScanner();
        return;
      }

      // Extrai o ID do Coffeemon da URL
      const coffeemonId = data.replace('coffeemon://add/', '');
      
      if (!coffeemonId || isNaN(Number(coffeemonId))) {
        Alert.alert('Erro', 'ID do Coffeemon inválido no QR code.');
        resetScanner();
        return;
      }

      // Faz requisição para adicionar o Coffeemon ao jogador
      const response = await fetch(
        `${getServerUrl()}/game/players/me/coffeemons/${coffeemonId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const coffeemon = await response.json();
        Alert.alert(
          '✅ Coffeemon Capturado!',
          `${coffeemon.coffeemon.name} foi adicionado ao seu inventário!\n\nHP: ${coffeemon.hp}\nAtaque: ${coffeemon.attack}\nDefesa: ${coffeemon.defense}`,
          [
            {
              text: 'OK',
              onPress: () => {
                onCoffeemonAdded();
                onClose();
              },
            },
          ]
        );
      } else if (response.status === 404) {
        Alert.alert('Erro', 'Coffeemon não encontrado.');
        resetScanner();
      } else if (response.status === 409) {
        Alert.alert('Aviso', 'Você já possui este Coffeemon!');
        resetScanner();
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.message || 'Erro ao adicionar Coffeemon.');
        resetScanner();
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Erro', 'Erro de conexão ao processar QR code.');
      resetScanner();
    } finally {
      setProcessing(false);
    }
  }

  function resetScanner() {
    setScanned(false);
  }

  function handleClose() {
    setScanned(false);
    setProcessing(false);
    onClose();
  }

  if (!visible) return null;

  if (hasPermission === null) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.text}>Solicitando permissão da câmera...</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.text}>
            ❌ Sem permissão para acessar a câmera
          </Text>
          <Text style={styles.subText}>
            Ative a permissão nas configurações do app
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <Text style={styles.title}>📷 Escaneie o QR Code</Text>
              <Text style={styles.instruction}>
                Aponte a câmera para o QR code do Coffeemon
              </Text>
            </View>

            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {processing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.processingText}>Processando...</Text>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              {scanned && !processing && (
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={resetScanner}
                >
                  <Text style={styles.rescanButtonText}>🔄 Escanear Novamente</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instruction: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#2ecc71',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  processingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  footer: {
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  rescanButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
});
