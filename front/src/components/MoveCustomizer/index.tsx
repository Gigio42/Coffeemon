import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Move, PlayerCoffeemon } from '../../api/coffeemonService';
import { getTypeColorScheme } from '../../theme/colors';
import { styles } from './styles';
import { useTheme } from '../../theme/ThemeContext';

interface AvailableMove extends Move {
  learnMethod?: string;
  levelLearned?: number;
}

interface MoveCustomizerProps {
  coffeemon: PlayerCoffeemon;
  onSave: (selectedMoveIds: number[]) => Promise<void>;
  onClose: () => void;
  onLoadAvailableMoves: (playerCoffeemonId: number) => Promise<AvailableMove[]>;
  token?: string | null;
}

export default function MoveCustomizer({
  coffeemon,
  onSave,
  onClose,
  onLoadAvailableMoves,
  token,
}: MoveCustomizerProps) {
  const { colors } = useTheme();
  const typeColors = getTypeColorScheme(coffeemon.coffeemon.types?.[0] || 'roasted');

  const [availableMoves, setAvailableMoves] = useState<AvailableMove[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<AvailableMove[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMoves();
  }, []);

  const loadMoves = async () => {
    try {
      setLoading(true);
      const moves = await onLoadAvailableMoves(coffeemon.id);
      setAvailableMoves(moves);

      // Inicializar com os moves atuais equipados
      const currentMoves = coffeemon.learnedMoves
        ?.sort((a, b) => a.slot - b.slot)
        .map((lm) => lm.move) || [];
      
      setSelectedMoves(currentMoves.slice(0, 4));
    } catch (error) {
      console.error('Erro ao carregar moves:', error);
      Alert.alert('Erro', 'Não foi possível carregar os moves disponíveis');
    } finally {
      setLoading(false);
    }
  };

  const toggleMove = (move: AvailableMove) => {
    const isSelected = selectedMoves.find((m) => m.id === move.id);

    if (isSelected) {
      // Remove o move
      setSelectedMoves(selectedMoves.filter((m) => m.id !== move.id));
    } else if (selectedMoves.length < 4) {
      // Adiciona o move (máximo 4)
      setSelectedMoves([...selectedMoves, move]);
    }
  };

  const handleSave = async () => {
    if (selectedMoves.length < 1) {
      Alert.alert('Atenção', 'Você precisa selecionar pelo menos 1 move');
      return;
    }

    if (selectedMoves.length > 4) {
      Alert.alert('Atenção', 'Você pode selecionar no máximo 4 moves');
      return;
    }

    try {
      setSaving(true);
      const moveIds = selectedMoves.map((m) => m.id);
      await onSave(moveIds);
      // Sucesso - fechar customizador (o modal pai vai tratar o feedback)
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar moves:', error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar os moves');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'attack' ? '#EF4444' : '#3B82F6';
  };

  const getTypeIcon = (type: string | null) => {
    const icons: Record<string, string> = {
      roasted: '🔥',
      sweet: '🍬',
      bitter: '☕',
      milky: '🥛',
      iced: '❄️',
      nutty: '🌰',
      fruity: '🍎',
      spicy: '🌶️',
      sour: '🍋',
      floral: '🌸',
    };
    return type ? icons[type] || '⭐' : '⭐';
  };

  if (loading) {
    return (
      <View style={[styles.customizer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={typeColors.primary} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Carregando moves...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.customizer, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Customizar Moves
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            {coffeemon.coffeemon.name}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Slots Selecionados (4) */}
      <View style={styles.slotsContainer}>
        <Text style={[styles.slotsTitle, { color: colors.text.primary }]}>
          Moves Equipados ({selectedMoves.length}/4)
        </Text>
        <Text style={[styles.slotsHelper, { color: colors.text.tertiary }]}>
          Selecione de 1 a 4 moves
        </Text>
        <View style={styles.slotsGrid}>
          {[0, 1, 2, 3].map((index) => {
            const move = selectedMoves[index];
            return (
              <View key={index} style={styles.slot}>
                {move ? (
                  <TouchableOpacity
                    style={[styles.slotFilled, { backgroundColor: typeColors.primary }]}
                    onPress={() => toggleMove(move)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.slotContent}>
                      <Text style={styles.slotNumber}>#{index + 1}</Text>
                      <Text style={styles.slotMoveName} numberOfLines={1}>
                        {move.name}
                      </Text>
                      <Text style={styles.slotMoveType} numberOfLines={1}>
                        {getTypeIcon(move.elementalType)} {move.elementalType || 'Normal'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.slotEmpty, { borderColor: colors.border.default }]}>
                    <Text style={[styles.slotEmptyNumber, { color: colors.text.tertiary }]}>
                      #{index + 1}
                    </Text>
                    <Text style={[styles.slotEmptyText, { color: colors.text.tertiary }]}>
                      Vazio
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Lista de Moves Disponíveis */}
      <View style={styles.movesListContainer}>
        <Text style={[styles.movesTitle, { color: colors.text.secondary }]}>
          Moves Desbloqueados ({availableMoves.length})
        </Text>
        <Text style={[styles.movesSubtitle, { color: colors.text.tertiary }]}>
          Nível atual: {coffeemon.level}
        </Text>
        <ScrollView 
          style={styles.movesList} 
          contentContainerStyle={styles.movesListContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          bounces={true}
        >
          {availableMoves.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text.tertiary }]}>
                Nenhum move desbloqueado ainda.
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.text.tertiary }]}>
                Suba de nível para desbloquear mais moves!
              </Text>
            </View>
          ) : (
            availableMoves.map((move) => {
            const isSelected = selectedMoves.find((m) => m.id === move.id);
            const canSelect = selectedMoves.length < 4 || isSelected;

            return (
              <TouchableOpacity
                key={move.id}
                style={[
                  styles.moveCard,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: isSelected ? typeColors.primary : colors.border.default,
                  },
                  isSelected && styles.moveCardSelected,
                  !canSelect && styles.moveCardDisabled,
                ]}
                onPress={() => toggleMove(move)}
                disabled={!canSelect}
                activeOpacity={0.7}
              >
                <View style={styles.moveCardLeft}>
                  <View style={styles.moveCardHeader}>
                    <Text style={[styles.moveCardName, { color: colors.text.primary }]}>
                      {move.name}
                    </Text>
                    {isSelected && (
                      <View
                        style={[styles.checkmark, { backgroundColor: typeColors.primary }]}
                      >
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[styles.moveCardDescription, { color: colors.text.secondary }]}
                    numberOfLines={2}
                  >
                    {move.description}
                  </Text>
                  
                  <View style={styles.moveCardStatsRow}>
                    <View
                      style={[
                        styles.moveCardTypeBadge,
                        { backgroundColor: typeColors.primary + '20' },
                      ]}
                    >
                      <Text style={[styles.moveCardTypeText, { color: typeColors.primary }]}>
                        {getTypeIcon(move.elementalType)} {move.elementalType || 'Normal'}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.moveCardCategoryBadge,
                        { backgroundColor: getCategoryColor(move.category) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.moveCardCategoryText,
                          { color: getCategoryColor(move.category) },
                        ]}
                      >
                        {move.category === 'attack' ? '⚔️' : '🛡️'}
                      </Text>
                    </View>
                    <View style={styles.moveCardPowerBadge}>
                      <Text style={[styles.moveCardPowerText, { color: colors.text.tertiary }]}>
                        ⚡{move.power}
                      </Text>
                    </View>
                    {move.learnMethod === 'start' && (
                      <View style={[styles.moveCardLevelBadge, { backgroundColor: '#10B981' + '20' }]}>
                        <Text style={[styles.moveCardLevelText, { color: '#10B981' }]}>
                          Inicial
                        </Text>
                      </View>
                    )}
                    {move.learnMethod === 'level_up' && move.levelLearned && (
                      <View style={[styles.moveCardLevelBadge, { backgroundColor: '#8B5CF6' + '20' }]}>
                        <Text style={[styles.moveCardLevelText, { color: '#8B5CF6' }]}>
                          Lv {move.levelLearned}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
          )}
        </ScrollView>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.border.default }]}
          onPress={onClose}
          disabled={saving}
        >
          <Text style={[styles.cancelButtonText, { color: colors.text.secondary }]}>
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: typeColors.primary },
            (selectedMoves.length < 1 || selectedMoves.length > 4 || saving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={selectedMoves.length < 1 || selectedMoves.length > 4 || saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
