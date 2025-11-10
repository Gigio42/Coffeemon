import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.fullscreen}>
          <BlurView intensity={20} style={styles.blurContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleWrapper}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.modalContent}
                  style={styles.carousel}
                >
                  {availableCoffeemons.length === 0 ? (
                    <Text style={styles.emptyText}>{modalEmptyMessage}</Text>
                  ) : (
                    <View style={styles.carouselContent}>
                      {availableCoffeemons.map((coffeemon, index) => {
                        const defaultId = (coffeemon as unknown as PlayerCoffeemon)?.id;
                        const key = keyExtractor ? keyExtractor(coffeemon, index) : String(defaultId ?? index);
                        const isLoading = partyLoading != null && defaultId !== undefined
                          ? partyLoading === defaultId
                          : false;
                        const handleSelect = () => onSelectCoffeemon(coffeemon);

                        if (renderCoffeemonCard) {
                          const cardNode = renderCoffeemonCard(coffeemon, {
                            onSelect: handleSelect,
                            isLoading,
                          });

                          if (React.isValidElement(cardNode)) {
                            return React.cloneElement(cardNode, { key });
                          }

                          return <React.Fragment key={key}>{cardNode}</React.Fragment>;
                        }

                        return (
                          <CoffeemonCard
                            key={key}
                            coffeemon={coffeemon as unknown as PlayerCoffeemon}
                            onToggleParty={async () => {
                              await handleSelect();
                            }}
                            isLoading={isLoading}
                            variant={cardVariant}
                          />
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
