import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '../../tailwind';
import { ContactOption } from '../../utils/contactPicker';

interface ContactPickerModalProps {
  visible: boolean;
  loading: boolean;
  contacts: ContactOption[];
  onSelect: (contact: ContactOption) => void;
  onClose: () => void;
  onRetry: () => void;
}

const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  visible,
  loading,
  contacts,
  onSelect,
  onClose,
  onRetry,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-lg poppinsMedium`}>Select contact</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close contact picker">
              <Text style={tw`text-base poppins text-blue-800`}>Close</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={tw`py-8 items-center`}>
              <ActivityIndicator size="large" color="#1E3A8A" />
              <Text style={tw`mt-3 poppins text-gray-500`}>
                Loading contacts…
              </Text>
            </View>
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => onSelect(item)}
                  accessibilityHint={`Select ${item.name}`}
                >
                  <Text style={tw`poppinsMedium text-base`}>{item.name}</Text>
                  <Text style={tw`poppins text-gray-500 mt-1`}>
                    {item.phoneNumber}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={tw`py-8 items-center`}>
                  <Text style={tw`poppins text-center text-gray-500`}>
                    No contacts with phone numbers found.
                  </Text>
                  <TouchableOpacity
                    style={tw`mt-4 px-4 py-2 rounded-md border border-blue-800`}
                    onPress={onRetry}
                  >
                    <Text style={tw`poppins text-blue-800`}>Retry</Text>
                  </TouchableOpacity>
                </View>
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              style={tw`-mx-2`}
              contentContainerStyle={contacts.length === 0 ? undefined : tw`px-2 py-2`}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '80%',
    padding: 20,
  },
  contactItem: {
    paddingVertical: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
});

export default ContactPickerModal;

