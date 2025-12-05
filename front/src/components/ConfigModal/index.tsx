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
  const [selectedPreset, setSelectedPreset] = useState<'prod' | 'local' | 'custom' | null>(null);
  
  const { alertState, hideAlert, showError, showSuccess } = useCustomAlert();

  // URLs constantes
  const PROD_URL = "https://coffeemon-back.onrender.com";
  // Tenta adivinhar IP local ou usa localhost genérico (usuário pode editar depois)
  const LOCAL_URL = "http://192.168.1.10:3000"; 

  useEffect(() => {
    if (visible) {
      setLoading(true);
      const loadUrl = async () => {
        const currentUrl = await getServerUrl();
        setUrlInput(currentUrl);
        
        // Detectar preset atual
        if (currentUrl.includes('onrender.com')) setSelectedPreset('prod');
        else if (currentUrl.includes('localhost') || currentUrl.includes('192.168')) setSelectedPreset('local');
        else setSelectedPreset('custom');
        
        setLoading(false);
      };
      loadUrl();
    }
  }, [visible]);

  const handleSelectPreset = (type: 'prod' | 'local') => {
    setSelectedPreset(type);
    if (type === 'prod') {
      setUrlInput(PROD_URL);
    } else {
      setUrlInput(LOCAL_URL);
    }
  };

  const handleSave = async () => {
    if (!urlInput.trim()) {
      showError('Erro', 'A URL não pode estar vazia.');
      return;
    }
    await setServerUrl(urlInput);
    showSuccess('Salvo!', 'Ambiente configurado com sucesso.', onClose);
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
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Configurar Servidor</Text>
            <Text style={styles.modalSubtitle}>Selecione o ambiente de conexão</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.secondary} />
          ) : (
            <View style={{ width: '100%' }}>
              
              {/* Botões de Seleção */}
              <View style={styles.presetsContainer}>
                <TouchableOpacity
                  style={[
                    styles.presetButton,
                    selectedPreset === 'prod' && styles.presetButtonActive
                  ]}
                  onPress={() => handleSelectPreset('prod')}
                >
                  <Text style={styles.presetIcon}>☁️</Text>
                  <Text style={[
                    styles.presetTitle,
                    selectedPreset === 'prod' && styles.presetTitleActive
                  ]}>Produção</Text>
                  <Text style={styles.presetDesc}>Servidor Oficial</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.presetButton,
                    selectedPreset === 'local' && styles.presetButtonActive
                  ]}
                  onPress={() => handleSelectPreset('local')}
                >
                  <Text style={styles.presetIcon}>💻</Text>
                  <Text style={[
                    styles.presetTitle,
                    selectedPreset === 'local' && styles.presetTitleActive
                  ]}>Localhost</Text>
                  <Text style={styles.presetDesc}>Desenvolvimento</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>URL do Servidor:</Text>
              <TextInput
                style={styles.input}
                placeholder="http://..."
                value={urlInput}
                onChangeText={(text) => {
                  setUrlInput(text);
                  setSelectedPreset('custom');
                }}
                autoCapitalize="none"
                keyboardType="url"
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.modalButtonText, { color: '#555' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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