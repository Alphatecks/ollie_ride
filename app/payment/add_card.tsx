import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import tw from '../../tailwind'
import CardSVG from "../../assets/card.svg"
import MasterCardSVG from "../../assets/mastercard.svg"
import { Button } from 'react-native-ui-lib'

const Index = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Function to format card number as "#### #### #### ####"
  const formatCardNumber = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit length to 16 digits
    const limited = cleaned.slice(0, 16);
    // Add spaces every 4 digits
    return limited.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Function to format expiry date as "MM/YY"
  const formatExpiryDate = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 4 digits (MMYY)
    let formatted = cleaned.slice(0, 4);
    
    // Insert slash after MM if applicable
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }

    return formatted;
  };

  console.log(cardNumber, cardHolder, expiryDate)

  return (
    <View style={tw`bg-white flex-1 p-4`}>
      <View style={tw`flex-1 justify-between`}>
        <View>
          <View style={tw`items-center relative`}>
            <View>
              <CardSVG />
            </View>
            <MasterCardSVG style={tw`absolute top-13 right-20`} />

            {/* Card Number Display */}
            <Text style={tw`absolute text-white poppins top-30 left-22 text-lg`}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>

            {/* Card Holder and Expiry Date */}
            <View style={tw`absolute top-36 left-22 flex-row gap-8`}>
              <Text style={tw`text-white poppins text-xs`}>
                {cardHolder || 'CARD HOLDER'}
              </Text>
              <Text style={tw`text-white poppins text-xs`}>
                {expiryDate || 'MM/YY'}
              </Text>
            </View>
          </View>

          <Text style={tw`poppinsMedium mt-4`}>Card Details</Text>

          <View style={tw`gap-8 my-3`}>
            <TextInput
              style={tw`border-[1px] border-gray-500 p-3 text-black rounded-md`}
              placeholder="Name Of Card Holder"
              // value={cardHolder}
              onChangeText={setCardHolder}
            />
            <TextInput
              style={tw`border-[1px] border-gray-500 p-3 rounded-md`}
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              maxLength={19} // 16 digits + 3 spaces
            />

            <View style={tw`flex-row gap-8`}>
              <TextInput
                style={tw`border-[1px] border-gray-500 p-3 flex-1 rounded-md`}
                placeholder="MM/YY"
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                maxLength={5} // "MM/YY"
              />
              <TextInput
                style={tw`border-[1px] border-gray-500 p-3 flex-1 rounded-md`}
                placeholder="CVV"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        <Button label="Add Card" poppins style={tw`btn`} />
      </View>

      <Stack.Screen
        options={{
          headerShown: true,
          title: "Add Card",
        }}
      />
    </View>
  );
};

export default Index;
