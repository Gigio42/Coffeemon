import React from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import CoffeemonCard from '../CoffeemonCard';
import { PlayerCoffeemon } from '../../api/coffeemonService';
import { styles } from './styles';

const qrCodeIcon = require('../../../assets/icons/qrcode.png');

interface TeamSectionProps {
  title: string;
  coffeemons: PlayerCoffeemon[];
  loading: boolean;
  emptyMessage: string;
  onToggleParty: (coffeemon: PlayerCoffeemon) => Promise<void>;
  partyLoading: number | null;
  variant: 'grid' | 'horizontal';
  showAddButton?: boolean;
  onAddCoffeemon?: () => void;
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showQrButton?: boolean;
  onPressQrButton?: () => void;
  qrButtonDisabled?: boolean;
  children?: React.ReactNode;
}

export default function TeamSection({
  title,
  coffeemons,
  loading,
  emptyMessage,
  onToggleParty,
  partyLoading,
  variant,
  showAddButton = false,
  onAddCoffeemon,
  isCollapsible = false,
  isExpanded = false,
  onToggleExpand,
  showQrButton = false,
  onPressQrButton,
  qrButtonDisabled = false,
  children,
}: TeamSectionProps) {
  const hasAction = showAddButton && !!onAddCoffeemon;
  const HeaderComponent = isCollapsible ? TouchableOpacity : View;
  const headerProps = isCollapsible
    ? { onPress: onToggleExpand, activeOpacity: 0.85 }
    : {};
  const contentVisible = !isCollapsible || isExpanded;
  const showQrAction = showQrButton && typeof onPressQrButton === 'function';

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      );
    }

    if (coffeemons.length === 0) {
      return <Text style={styles.emptyText}>{emptyMessage}</Text>;
    }

    return (
      variant === 'horizontal' ? (
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.availableGridContent}
          nestedScrollEnabled={true}
          style={{ height: 550 }}
        >
          <View style={styles.availableGrid}>
            {coffeemons.map((pc) => (
              <View key={pc.id} style={styles.availableCardWrapper}>
                <View style={styles.availableCardScaler}>
                  <CoffeemonCard
                    coffeemon={pc}
                    onToggleParty={onToggleParty}
                    isLoading={partyLoading === pc.id}
                    variant="small"
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={{ width: '100%', marginTop: 0 }}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          style={styles.grid}
        >
          <View style={styles.gridContainer}>
            {coffeemons.map((pc) => (
              <CoffeemonCard
                key={pc.id}
                coffeemon={pc}
                onToggleParty={onToggleParty}
                isLoading={partyLoading === pc.id}
                variant="small" // Assuming small for grid
              />
            ))}
          </View>
        </ScrollView>
      )
    );
  };

  return (
    <View style={styles.teamSection}>
      <View style={[styles.sectionHeaderRow, variant === 'grid' && styles.sectionHeaderRowCompact]}>
        <HeaderComponent
          style={[
            styles.sectionHeaderButton,
            !isCollapsible && styles.sectionHeaderButtonStatic,
          ]}
          {...headerProps}
        >
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {isCollapsible && (
              <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
            )}
          </View>
        </HeaderComponent>

        {showQrAction && (
          <TouchableOpacity
            style={[styles.qrButton, qrButtonDisabled && styles.qrButtonDisabled]}
            onPress={onPressQrButton}
            activeOpacity={0.85}
            disabled={qrButtonDisabled}
          >
            <Image source={qrCodeIcon} style={styles.qrIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}

        {hasAction && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddCoffeemon}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
      {contentVisible && renderContent()}
    </View>
  );
}
