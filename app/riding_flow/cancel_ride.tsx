import { View, Text, RadioGroup, RadioButton, Button } from 'react-native-ui-lib';
import {TextInput} from "react-native"
import React, { useState } from 'react';
import tw from '../../tailwind';

const CancelRide = () => {
  const [currentValue, setCurrentValue] = useState('');
  const [otherText, setOtherText] = useState<string>('');
  const [showTextArea, setShowTextArea] = useState<boolean>(false);

  const handleValueChange = (value: string) => {

    console.log(value)

    setCurrentValue(value);
    setShowTextArea(value === 'Other');
  };

  const handleOtherText = (value: string) => {
    setOtherText(value)
  }

  return (
    <View style={tw`p-3 bg-white flex-1 justify-between`}>
        <View>
            <Text style={tw`poppins text-center mb-3`}>
            Please select the reason for cancellation
            </Text>

            <RadioGroup
            initialValue={currentValue}
            onValueChange={handleValueChange}
            style={tw`my-3`}
            >
            <RadioButton
                labelStyle={tw`poppins`}
                value={'Rider not available'}
                label={'Rider not available'}
            />
            <RadioButton
                labelStyle={tw`poppins`}
                marginT-10
                value={'Rider wants to book another ride'}
                label={'Rider wants to book another ride'}
            />
            <RadioButton
                labelStyle={tw`poppins`}
                marginT-10
                value={'Rider misconduct'}
                label={'Rider misconduct'}
            />
            <RadioButton
                labelStyle={tw`poppins`}
                marginT-10
                value={'Vehicle breakdown'}
                label={'Vehicle breakdown'}
            />
            <RadioButton
                labelStyle={tw`poppins`}
                marginT-10
                value={'Other'}
                label={'Other'}
            />
            </RadioGroup>

            {showTextArea && (
                <TextInput
                placeholder="Please specify your reason"
                style={tw`mt-3 p-2 border border-gray-300 rounded poppins`}
                numberOfLines={8}
                textAlignVertical='top'
                onChangeText={handleOtherText} // Update state here if needed
                />
            )}
        </View>

        <Button label="Cancel Ride" poppins style={tw`btn`} />

    </View>
  );
};

export default CancelRide;
