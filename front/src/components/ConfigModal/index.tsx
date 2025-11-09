import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getServerUrl, setServerUrl } from '../../utils/config';
import { colors } from '../../theme';
import { styles } from './styles';
import CustomAlert from '../Ecommerce/CustomAlert';
import { useCustomAlert } from '../../hooks/useCustomAlert';

interface ConfigModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConfigModal({ visible, onClose }: ConfigModalProps) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { alertState, hideAlert, showError, showSuccess } = useCustomAlert();

  useEffect(() => {
    if (visible) {
      setLoading(true);
      const loadUrl = async () => {
        const currentUrl = await getServerUrl();
        setUrlInput(currentUrl);
        setLoading(false);
      };
      loadUrl();
    }
  }, [visible]);

  const handleSave = async () => {
    if (!urlInput.trim()) {
      showError('Erro', 'A URL não pode estar vazia.');
      return;
    }
    await setServerUrl(urlInput);
    showSuccess('Sucesso', 'Endereço do servidor salvo!', onClose);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Configurar Servidor</Text>
          {loading ? (
            <ActivityIndicator size="large" color={colors.secondary} />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Endereço do Servidor"
              value={urlInput}
              onChangeText={setUrlInput}
              autoCapitalize="none"
              keyboardType="url"
            />
          )}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CustomAlert
          visible={alertState.visible}
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          onClose={hideAlert}
          showCancel={alertState.showCancel}
          onConfirm={alertState.onConfirm}
          confirmText={alertState.confirmText}
          cancelText={alertState.cancelText}
        />
      </View>
    </Modal>
  );
}
