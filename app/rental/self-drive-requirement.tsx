import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import tw from '../../tailwind';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { RentalCar } from '../../constants/Data';
import Toast from 'react-native-toast-message';
import { auth, storage, db } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SelfDriveRequirementParams {
  car: RentalCar;
  rentType: string;
  pickupDate: Date;
  returnDate: Date;
}

const SelfDriveRequirementScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { car, rentType, pickupDate, returnDate } = route.params as SelfDriveRequirementParams;

  const [selectedIdType, setSelectedIdType] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);
  const [showIdPicker, setShowIdPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const idTypes = [
    "Driver's License",
    "National ID",
    "International Passport"
  ];

  const pickDocument = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to pick document'
        });
        return;
      }

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Validate file size (max 123MB = 128974848 bytes)
        if (file.fileSize && file.fileSize > 128974848) {
          Toast.show({
            type: 'error',
            text1: 'File too large',
            text2: 'Maximum file size is 123MB'
          });
          return;
        }

        // Validate file type
        const fileType = file.type || '';
        if (!fileType.includes('image/jpeg') && !fileType.includes('image/jpg') && !fileType.includes('image/png')) {
          Toast.show({
            type: 'error',
            text1: 'Invalid format',
            text2: 'Only JPG and PNG files are accepted'
          });
          return;
        }

        setUploadedDocument(file);
        Toast.show({
          type: 'success',
          text1: 'Document selected',
          text2: file.fileName || 'Document ready to upload'
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick document'
      });
    }
  };

  const handleContinue = async () => {
    if (!selectedIdType) {
      Toast.show({
        type: 'error',
        text1: 'ID Type Required',
        text2: 'Please select your ID type'
      });
      return;
    }

    if (!uploadedDocument) {
      Toast.show({
        type: 'error',
        text1: 'Document Required',
        text2: 'Please upload your ID document'
      });
      return;
    }

    try {
      setIsUploading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'Not Authenticated',
          text2: 'Please log in to continue'
        });
        setIsUploading(false);
        return;
      }

      // Upload document to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${selectedIdType.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}`;
      const storageRef = ref(storage, `riders/${user.uid}/documents/${fileName}`);
      
      // Convert URI to blob
      const response = await fetch(uploadedDocument.uri);
      const blob = await response.blob();
      
      // Upload file
      await uploadBytes(storageRef, blob);
      const documentUrl = await getDownloadURL(storageRef);

      setIsUploading(false);
      
      Toast.show({
        type: 'success',
        text1: 'Document Uploaded',
        text2: 'Proceeding to booking summary'
      });

      // Navigate to booking summary
      navigation.navigate('BookingSummary', {
        car,
        rentType: 'self',
        pickupDate,
        returnDate,
        documentUrl,
        idType: selectedIdType
      });

    } catch (error) {
      console.error('Error submitting booking:', error);
      setIsUploading(false);
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: 'Failed to submit booking. Please try again.'
      });
    }
  };

  const isFormValid = selectedIdType !== '' && uploadedDocument !== null;

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 py-4 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={tw`absolute left-0 right-0 items-center`}>
          <Text style={[tw`text-lg text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
            Self-Drive Requirement
          </Text>
        </View>
      </View>

      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Instructions */}
        <View style={tw`mb-6`}>
          <Text style={[tw`text-xl text-gray-800 mb-3`, { fontFamily: 'Poppins-Bold' }]}>
            Upload your document
          </Text>
          <Text style={[tw`text-sm text-gray-600 leading-6`, { fontFamily: 'Poppins-Regular' }]}>
            Please upload the following documents to verify your eligibility for self-drive services. Ensure all documents are clear and legible.
          </Text>
        </View>

        {/* ID Type Selection */}
        <View style={tw`mb-6`}>
          <Text style={[tw`text-base text-gray-800 mb-2`, { fontFamily: 'Poppins-Bold' }]}>
            ID type
          </Text>
          <TouchableOpacity 
            style={styles.idTypeField}
            onPress={() => setShowIdPicker(true)}
          >
            <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#6B7280" />
            <Text style={[
              tw`flex-1 ml-3 text-base`,
              selectedIdType ? tw`text-gray-800` : tw`text-gray-400`,
              { fontFamily: 'Poppins-Regular' }
            ]}>
              {selectedIdType || 'Select ID'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Upload ID Section */}
        <View style={tw`mb-6`}>
          <Text style={[tw`text-base text-gray-800 mb-2`, { fontFamily: 'Poppins-Bold' }]}>
            Upload ID
          </Text>
          
          <TouchableOpacity 
            style={styles.uploadArea}
            onPress={pickDocument}
          >
            {uploadedDocument ? (
              <View style={tw`items-center`}>
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                <Text style={[tw`text-sm text-green-600 mt-2`, { fontFamily: 'Poppins-Bold' }]}>
                  Document uploaded successfully
                </Text>
                <Text style={[tw`text-xs text-gray-500 mt-1`, { fontFamily: 'Poppins-Regular' }]}>
                  {uploadedDocument.fileName || 'Document ready'}
                </Text>
              </View>
            ) : (
              <View style={tw`items-center`}>
                <Ionicons name="arrow-up-outline" size={32} color="#9CA3AF" />
                <Text style={[tw`text-sm text-gray-400 mt-2`, { fontFamily: 'Poppins-Regular' }]}>
                  Tap to upload
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={tw`flex-row items-start mt-2`}>
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" style={tw`mr-2 mt-1`} />
            <Text style={[tw`text-xs text-gray-400 flex-1`, { fontFamily: 'Poppins-Regular' }]}>
              Acceptable formats (JPG, PNG, PDF) and file size 123mb
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={tw`mt-8`}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isFormValid && !isUploading ? styles.continueButtonEnabled : styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!isFormValid || isUploading}
          >
            <Text style={[tw`text-base text-white`, { fontFamily: 'Poppins-Bold' }]}>
              {isUploading ? 'Uploading...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ID Type Picker Modal */}
      <Modal
        visible={showIdPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIdPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowIdPicker(false)}
        >
          <View style={styles.pickerModal}>
            <View style={tw`p-4 border-b border-gray-200`}>
              <Text style={[tw`text-lg text-gray-800 text-center`, { fontFamily: 'Poppins-Bold' }]}>
                Select ID Type
              </Text>
            </View>
            {idTypes.map((type, index) => (
              <TouchableOpacity
                key={type}
                style={[
                  tw`p-4 flex-row items-center`,
                  index < idTypes.length - 1 && tw`border-b border-gray-100`
                ]}
                onPress={() => {
                  setSelectedIdType(type);
                  setShowIdPicker(false);
                }}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={24} color="#1E3A8A" />
                <Text style={[tw`ml-3 text-base text-gray-800`, { fontFamily: 'Poppins-Regular' }]}>
                  {type}
                </Text>
                {selectedIdType === type && (
                  <Ionicons name="checkmark-circle" size={24} color="#1E3A8A" style={tw`ml-auto`} />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={tw`p-4 items-center bg-gray-50`}
              onPress={() => setShowIdPicker(false)}
            >
              <Text style={[tw`text-base text-gray-600`, { fontFamily: 'Poppins-Bold' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  idTypeField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 32,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: '#1E3A8A',
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
});

export default SelfDriveRequirementScreen;

