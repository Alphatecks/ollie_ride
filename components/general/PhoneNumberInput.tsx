import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

// Add more countries as needed
const countries = [
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  // Add more countries as needed
];

interface CountryData {
  code: string;
  flag: string;
  name: string;
}

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onChangeCountry?: (country: CountryData) => void;
  placeholder?: string;
  defaultCountry?: string; // country code like +880
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  errorMessage?: string;
  isValid?: boolean;
  maxLength?: number;
  testID?: string;
  keyboardType?: TextInputProps['keyboardType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChangeText,
  onChangeCountry,
  placeholder = 'Your mobile number',
  defaultCountry = '+880',
  containerStyle,
  inputStyle,
  dropdownStyle,
  errorMessage,
  isValid,
  maxLength = 15,
  testID = 'phone-number-input',
  keyboardType = 'phone-pad',
  returnKeyType = 'done',
  onSubmitEditing,
  autoFocus = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set default country ONLY ON MOUNT
  useEffect(() => {
    if (!isInitialized) {
      const country = countries.find(c => c.code === defaultCountry);
      if (country) {
        setSelectedCountry(country);
        if (onChangeCountry) onChangeCountry(country);
      } else {
        // Fallback to first country if defaultCountry is not found
        setSelectedCountry(countries[0]);
        if (onChangeCountry) onChangeCountry(countries[0]);
      }
      setIsInitialized(true);
    }
  }, [defaultCountry, onChangeCountry, isInitialized]);

  // Handle search functionality
  useEffect(() => {
    if (searchText) {
      const filtered = countries.filter(
        country =>
          country.name.toLowerCase().includes(searchText.toLowerCase()) ||
          country.code.includes(searchText)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchText]);

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setModalVisible(false);
    if (onChangeCountry) {
      onChangeCountry(country);
    }
    setSearchText('');
  };

  const handleNumberChange = (text: string) => {
    // Only allow digits
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeText(numericText);
  };

  // Prevent numbers that are too long
  const formattedNumber = value.length > maxLength ? value.slice(0, maxLength) : value;

  return (
    <View testID={testID} style={[styles.container, containerStyle]}>
      {/* Error message */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      
      <View style={[
        styles.inputContainer, 
        isValid === false ? styles.inputContainerError : null
      ]}>
        {/* Country selector */}
        <TouchableOpacity
          testID={`${testID}-country-selector`}
          style={styles.countrySelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.flagText}>{selectedCountry?.flag}</Text>
          <Text style={styles.codeText}>{selectedCountry?.code}</Text>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>▼</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Phone number input */}
        <TextInput
          testID={`${testID}-input`}
          style={[styles.input, inputStyle]}
          value={formattedNumber}
          onChangeText={handleNumberChange}
          placeholder={placeholder}
          placeholderTextColor="#BEBEBE"
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
        />
      </View>

      {/* Country selection modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <SafeAreaView style={[styles.modalContent, dropdownStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                testID={`${testID}-close-modal`}
                onPress={() => {
                  setModalVisible(false);
                  setSearchText('');
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              testID={`${testID}-search-input`}
              style={styles.searchInput}
              placeholder="Search country..."
              value={searchText}
              onChangeText={setSearchText}
              clearButtonMode="always"
              autoCapitalize="none"
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  testID={`${testID}-country-${item.code}`}
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.noResults}>
                  <Text>No countries found</Text>
                </View>
              )}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 10,
    height: 56,
    backgroundColor: '#FFFFFF',
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    height: '100%',
  },
  flagText: {
    fontSize: 24,
    marginRight: 4,
  },
  codeText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 2,
  },
  arrowContainer: {
    marginLeft: 2,
  },
  arrow: {
    fontSize: 10,
    color: '#757575',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingLeft: 8,
    paddingRight: 16,
    color: '#000000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: '#757575',
    padding: 5,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 15,
    backgroundColor: '#F5F5F5',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  countryCode: {
    fontSize: 14,
    color: '#757575',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
});

export default PhoneNumberInput;