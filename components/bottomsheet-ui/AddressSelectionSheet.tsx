import React, { useRef, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RecentPlace } from '../../constants/Data';
import DoubleLocationCard, { DoubleLocationCardVariant } from '../home/DoubleLocationCard';

interface AddressSelectionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  fromLocation: string;
  toLocation: string;
  onFromChange: (text: string) => void;
  onToChange: (text: string) => void;
  recentPlaces: RecentPlace[];
  onPlaceSelect: (place: RecentPlace, field: 'from' | 'to') => void;
  fromSuggestions?: string[];
  toSuggestions?: string[];
  onFromSuggestionSelect?: (suggestion: string) => void;
  onToSuggestionSelect?: (suggestion: string) => void;
  isConfirmView?: boolean;
  onRequestConfirmView?: () => void;
  onConfirmLocation?: () => void;
  isBookingView?: boolean;
}

const AddressSelectionSheet: React.FC<AddressSelectionSheetProps> = ({
  isVisible,
  onClose,
  fromLocation,
  toLocation,
  onFromChange,
  onToChange,
  recentPlaces,
  onPlaceSelect,
  fromSuggestions = [],
  toSuggestions = [],
  onFromSuggestionSelect,
  onToSuggestionSelect,
  isConfirmView = false,
  onRequestConfirmView,
  onConfirmLocation,
  isBookingView = false,
}) => {
  const [selectedRide, setSelectedRide] = useState('economy');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => (
    isConfirmView ? ['35%'] : isBookingView ? ['50%', '70%'] : ['75%', '90%']
  ), [isConfirmView, isBookingView]);

  useEffect(() => {
    if (isVisible) {
      // Always open at the first snap point (shorter height)
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, snapPoints]);

  // When switching stages, enforce first snap point (confirm 35%, booking 50%)
  useEffect(() => {
    if (!isVisible) return;
    bottomSheetRef.current?.snapToIndex(0);
  }, [isConfirmView, isBookingView]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

  const renderRecentPlaceItem = ({ item }: { item: RecentPlace }) => (
    <TouchableOpacity
      style={styles.placeItem}
      onPress={() => onPlaceSelect(item, 'to')}
    >
      <View style={styles.placeIcon}>
        <Ionicons name="location" size={20} color="#1E3A8A" />
      </View>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>
      </View>
      <Text style={styles.placeDistance}>{item.distance}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      enablePanDownToClose={true}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={[styles.contentContainer, isConfirmView && styles.contentCompact]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select address</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {!isConfirmView && !isBookingView ? (
          <View>
            {/* From Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="my-location" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="From"
                  placeholderTextColor="#9CA3AF"
                  value={fromLocation}
                  onChangeText={onFromChange}
                />
              </View>
              {fromSuggestions.length > 0 && (
                <View style={styles.suggestionList}>
                  {fromSuggestions.map((s) => (
                    <TouchableOpacity key={s} style={styles.suggestionItem} onPress={() => onFromSuggestionSelect && onFromSuggestionSelect(s)}>
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* To Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="To"
                  placeholderTextColor="#9CA3AF"
                  value={toLocation}
                  onChangeText={onToChange}
                />
              </View>
              {toSuggestions.length > 0 && (
                <View style={styles.suggestionList}>
                  {toSuggestions.map((s) => (
                    <TouchableOpacity key={s} style={styles.suggestionItem} onPress={() => onToSuggestionSelect && onToSuggestionSelect(s)}>
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Continue button when both fields filled */}
            {fromLocation?.trim() && toLocation?.trim() && (
              <TouchableOpacity style={styles.primaryButton} onPress={onRequestConfirmView}>
                <Text style={styles.primaryButtonText}>Review locations</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : isConfirmView ? (
          <View>
            {/* Confirm view: summary of addresses */}
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconCurrent}>
                <Ionicons name="location" size={20} color="#1E3A8A" />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.placeAddress}>{fromLocation}</Text>
              </View>
            </View>
            <View style={styles.summaryConnector} />
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconDest}>
                <Ionicons name="location" size={20} color="#0B2C5D" />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.placeAddress}>{toLocation}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.primaryButton, { marginTop: 24 }]} onPress={onConfirmLocation}>
              <Text style={styles.primaryButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        

        {!isConfirmView && !isBookingView && (
          <>
            {/* Separator */}
            <View style={styles.separator} />

            {/* Recent Places */}
            <View style={styles.recentPlacesContainer}>
              <Text style={styles.recentPlacesTitle}>Recent places</Text>
              <FlatList
                data={recentPlaces}
                renderItem={renderRecentPlaceItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  contentCompact: {
    flex: undefined,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Poppins-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  recentPlacesContainer: {
    flex: 1,
  },
  recentPlacesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  placeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  placeAddress: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
  },
  placeDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins-Bold',
  },
  suggestionList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 8,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Poppins-Regular',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryIconCurrent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryIconDest: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryConnector: {
    height: 24,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    marginLeft: 18,
  },
  promoInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    color: '#111827',
  },
  bookingFooterButton: {
    marginTop: 16,
  },
});

export default AddressSelectionSheet;

