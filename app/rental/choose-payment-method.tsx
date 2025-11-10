import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import tw from '../../tailwind';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MasterCardIcon from '../../assets/mastercard.svg';
import Toast from 'react-native-toast-message';

interface PaymentMethod {
  id: string;
  type: 'mastercard' | 'visa' | 'paypal' | 'cashapp';
  cardNumber?: string;
  email?: string;
  label?: string;
  expiry: string;
  logo: any;
}

const ChoosePaymentMethodScreen = () => {
  const navigation = useNavigation();

  const initialPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'mastercard',
      cardNumber: '**** **** **** 8970',
      expiry: '12/26',
      logo: 'mastercard'
    },
    {
      id: '2',
      type: 'visa',
      cardNumber: '**** **** **** 8970',
      expiry: '12/26',
      logo: require('../../assets/Visa.png')
    },
    {
      id: '3',
      type: 'paypal',
      email: 'mailaddress@mail.com',
      expiry: '12/26',
      logo: require('../../assets/paypal.png')
    },
    {
      id: '4',
      type: 'cashapp',
      label: 'Cash',
      expiry: '12/26',
      logo: require('../../assets/cashapp.png')
    }
  ];

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('1');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);

  const handleSelect = (id: string) => {
    setSelectedPaymentId(id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedMethods = paymentMethods.filter(method => method.id !== id);
            setPaymentMethods(updatedMethods);

            // If deleted item was selected, select first remaining item
            if (id === selectedPaymentId && updatedMethods.length > 0) {
              setSelectedPaymentId(updatedMethods[0].id);
            }

            Toast.show({
              type: 'success',
              text1: 'Payment Method Deleted',
              text2: 'The payment method has been removed'
            });
          }
        }
      ]
    );
  };

  const handleAddCard = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Add payment method feature will be available soon'
    });
  };

  const handleContinue = () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentId);
    if (selectedMethod) {
      Toast.show({
        type: 'success',
        text1: 'Payment Method Selected',
        text2: 'Your payment method has been updated'
      });
    }
    navigation.goBack();
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => {
    const isSelected = item.id === selectedPaymentId;

    return (
      <TouchableOpacity
        style={[
          styles.paymentCard,
          isSelected && styles.paymentCardSelected
        ]}
        onPress={() => handleSelect(item.id)}
        activeOpacity={0.7}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          {item.type === 'mastercard' ? (
            <MasterCardIcon width={40} height={30} />
          ) : (
            <Image source={item.logo} style={styles.logo} resizeMode="contain" />
          )}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={[tw`text-base text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
            {item.cardNumber || item.email || item.label}
          </Text>
          <Text style={[tw`text-xs text-gray-600 mt-1`, { fontFamily: 'Poppins-Regular' }]}>
            Expires: {item.expiry}
          </Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 py-4 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={tw`absolute left-0 right-0 items-center`}>
          <Text style={[tw`text-lg text-gray-800`, { fontFamily: 'Poppins-Bold' }]}>
            Choose Payment Method
          </Text>
        </View>
      </View>

      {/* Payment Methods List */}
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-6 pt-4`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={tw`items-center py-12`}>
            <Ionicons name="card-outline" size={60} color="#9CA3AF" />
            <Text style={[tw`text-base text-gray-500 mt-4`, { fontFamily: 'Poppins-Regular' }]}>
              No payment methods available
            </Text>
          </View>
        }
        ListFooterComponent={
          <View>
            {/* Add Card Option */}
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={handleAddCard}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
              <Text style={[tw`text-base text-blue-600 ml-3`, { fontFamily: 'Poppins-Bold' }]}>
                Add card
              </Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <View style={tw`mt-6 mb-6`}>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                disabled={paymentMethods.length === 0}
              >
                <Text style={[tw`text-base text-white`, { fontFamily: 'Poppins-Bold' }]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentCardSelected: {
    backgroundColor: '#BFDBFE',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  logoContainer: {
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 30,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  deleteButton: {
    padding: 4,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChoosePaymentMethodScreen;

