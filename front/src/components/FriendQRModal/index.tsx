import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { theme } from '../../theme/theme';

const QR_FRIEND_PREFIX = 'coffeemon://friend/';
const QR_FRIEND_REGEX = /^coffeemon:\/\/friend\/([A-F0-9]{6})$/i;

const COPY_ICON = require('../../../assets/iconsv2/qr-code.png');

interface FriendQRModalProps {
  visible: boolean;
  myUid: string;
  onClose: () => void;
  onAddByUid: (uid: string) => void;
}

type ModalTab = 'show' | 'scan';

export default function FriendQRModal({
  visible,
  myUid,
  onClose,
  onAddByUid,
}: FriendQRModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('show');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!visible) {
      setActiveTab('show');
      setIsProcessing(false);
    }
  }, [visible]);

  const handleBarCodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (isProcessing) return;

      const trimmed = data?.trim() ?? '';
      const match = trimmed.match(QR_FRIEND_REGEX);
      if (!match) {
        Alert.alert('QR inválido', 'Use um QR code de amigo gerado pelo Coffeemon.');
        return;
      }

      const uid = match[1].toUpperCase();
      if (uid === myUid) {
        Alert.alert('Ops!', 'Você não pode se adicionar como amigo.');
        return;
      }

      setIsProcessing(true);
      try {
        onAddByUid(uid);
        Alert.alert('Pedido enviado!', `Pedido de amizade enviado para UID ${uid}.`);
        onClose();
      } finally {
        setTimeout(() => setIsProcessing(false), 500);
      }
    },
    [isProcessing, myUid, onAddByUid, onClose],
  );

  const handleScanTab = async () => {
    setActiveTab('scan');
    if (!permission?.granted) {
      await requestPermission();
    }
  };

  const renderShowTab = () => (
    <View style={styles.showContainer}>
      <Text style={styles.showLabel}>Meu QR Code</Text>
      <Text style={styles.showSub}>Mostre para um amigo escanear</Text>
      <View style={styles.qrWrapper}>
        <QRCode
          value={`${QR_FRIEND_PREFIX}${myUid}`}
          size={200}
          color={theme.colors.text.primary}
          backgroundColor="#FFFFFF"
        />
      </View>
      <View style={styles.uidPill}>
        <Text style={styles.uidPillText}>{myUid}</Text>
      </View>
    </View>
  );

  const renderScanTab = () => {
    if (!permission) {
      return (
        <View style={styles.permContainer}>
          <ActivityIndicator color={theme.colors.accent.primary} />
          <Text style={styles.permText}>Solicitando câmera…</Text>
        </View>
      );
    }
    if (!permission.granted) {
      return (
        <View style={styles.permContainer}>
          <Text style={styles.permDeniedTitle}>Câmera necessária</Text>
          <Text style={styles.permDeniedSub}>
            Conceda permissão de câmera para escanear QR codes.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestPermission}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        {/* Corners overlay */}
        <View style={styles.cameraOverlay}>
          <View style={styles.framingBox}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.scanHint}>Aponte para o QR Code de um amigo</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>QR Code de Amizade</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'show' && styles.tabActive]}
              onPress={() => setActiveTab('show')}
            >
              <Text style={[styles.tabText, activeTab === 'show' && styles.tabTextActive]}>
                Meu QR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'scan' && styles.tabActive]}
              onPress={handleScanTab}
            >
              <Text style={[styles.tabText, activeTab === 'scan' && styles.tabTextActive]}>
                Escanear
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={activeTab === 'scan' ? styles.scanContent : styles.showContent}>
            {activeTab === 'show' ? renderShowTab() : renderScanTab()}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { colors, spacing, radius, typography, shadows } = theme;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface.base,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingBottom: spacing.xxl,
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.medium,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: typography.weight.bold,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.lg,
    padding: 3,
    gap: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.surface.base,
    ...shadows.sm,
  },
  tabText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.primary,
  },

  // Show tab
  showContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  showContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  showLabel: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  showSub: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  qrWrapper: {
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    ...shadows.md,
  },
  uidPill: {
    marginTop: spacing.md,
    backgroundColor: colors.accent.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  uidPillText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.black,
    color: colors.text.inverse,
    letterSpacing: 4,
  },

  // Scan tab
  scanContent: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: 320,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  framingBox: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 3,
    borderColor: '#00FFC2',
    borderRadius: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanHint: {
    color: '#fff',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
  },

  // Permission states
  permContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  permText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  permDeniedTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  permDeniedSub: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryButtonText: {
    color: colors.text.inverse,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.sm,
  },
});
