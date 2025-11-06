import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getServerUrl, setServerUrl } from '../../utils/config';
import { colors } from '../../theme';
import { styles } from './styles';

interface ConfigModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConfigModal({ visible, onClose }: ConfigModalProps) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(true);

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
      Alert.alert('Erro', 'A URL não pode estar vazia.');
      return;
    }
    await setServerUrl(urlInput);
    Alert.alert('Sucesso', 'Endereço do servidor salvo!');
    onClose();
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
      </View>
    </Modal>
  );
}
