import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import CoffeemonCard from '../CoffeemonCard';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';

interface CoffeemonSelectionModalProps<T = PlayerCoffeemon> {
  visible: boolean;
  availableCoffeemons: T[];
  onSelectCoffeemon: (coffeemon: T) => Promise<void>;
  onClose: () => void;
  partyLoading?: number | null;
  title?: string;
  emptyMessage?: string;
  renderCoffeemonCard?: (
    coffeemon: T,
    helpers: { onSelect: () => Promise<void>; isLoading: boolean }
  ) => React.ReactNode;
  keyExtractor?: (coffeemon: T, index: number) => string;
  cardVariant?: 'large' | 'small';
}

export default function CoffeemonSelectionModal<T = PlayerCoffeemon>({
  visible,
  availableCoffeemons,
  onSelectCoffeemon,
  onClose,
  partyLoading = null,
  title,
  emptyMessage,
  renderCoffeemonCard,
  keyExtractor,
  cardVariant = 'large',
}: CoffeemonSelectionModalProps<T>) {
  const modalTitle = title ?? 'Escolha seu combatente!';
  const modalEmptyMessage = emptyMessage ?? 'Nenhum Coffeemon disponível';
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();

  const defaultKeyExtractor = React.useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }

      const defaultId = (item as unknown as PlayerCoffeemon)?.id;
      return String(defaultId ?? index);
    },
    [keyExtractor]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: T; index: number }) => {
      const defaultId = (item as unknown as PlayerCoffeemon)?.id;
      const isLoading = partyLoading != null && defaultId !== undefined
        ? partyLoading === defaultId
        : false;
      const handleSelect = () => onSelectCoffeemon(item);

      let content: React.ReactNode;

      if (renderCoffeemonCard) {
        const cardNode = renderCoffeemonCard(item, {
          onSelect: handleSelect,
          isLoading,
        });

        content = React.isValidElement(cardNode) ? cardNode : <>{cardNode}</>;
      } else {
        content = (
          <CoffeemonCard
            coffeemon={item as unknown as PlayerCoffeemon}
            onToggleParty={async () => {
              await handleSelect();
            }}
            isLoading={isLoading}
            variant={cardVariant}
          />
        );
      }

      return <View style={styles.carouselItem}>{content}</View>;
    },
    [cardVariant, onSelectCoffeemon, partyLoading, renderCoffeemonCard]
  );

  const modalContainerStyle = React.useMemo(
    () => [
      styles.modalContainer,
      {
        width: Math.min(viewportWidth * 0.9, 420),
        maxHeight: Math.min(viewportHeight * 0.85, 640),
        paddingHorizontal: viewportWidth < 480 ? 16 : 24,
        paddingVertical: viewportWidth < 480 ? 16 : 24,
      },
    ],
    [viewportHeight, viewportWidth]
  );

  const modalContent = (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={modalContainerStyle}>
        <View style={styles.modalHeader}>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
          </View>
        </View>

        {availableCoffeemons.length === 0 ? (
          <Text style={styles.emptyText}>{modalEmptyMessage}</Text>
        ) : (
          <FlatList
            horizontal
            data={availableCoffeemons}
            keyExtractor={defaultKeyExtractor}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const blurIntensity = Platform.OS === 'android' ? 55 : 30;
  const blurStyle = [
    styles.blurContainer,
    Platform.OS === 'android' ? styles.androidBackdrop : null,
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.fullscreen}>
          <BlurView
            intensity={blurIntensity}
            tint="dark"
            experimentalBlurMethod={
              Platform.OS === 'android' ? 'dimezisBlurView' : undefined
            }
            style={blurStyle}
          >
            {modalContent}
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
