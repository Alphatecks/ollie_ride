import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Button, RadioButton, RadioGroup } from 'react-native-ui-lib'
import tw from '../../../tailwind'
import { baseColor } from '../../../constants/Colors'
import CardInfo from '../../../components/bottomsheet-ui/CardInfo'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Index = () => {
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState("cash")
    console.log(currentPaymentMethod)
    const navigation = useNavigation()

    return (
        <View>
        <Text style={tw`poppinsMedium text-lg text-center my-4`}>Select Payment Method</Text>
        
        <RadioGroup initialValue={currentPaymentMethod} onValueChange={setCurrentPaymentMethod}>
                <View style={tw`flex-row gap-6`}>
                    <RadioButton value={'Cash'} color={baseColor}  />
                    <Text>Cash</Text>
                </View>

                <View style={tw`flex-row gap-6 mt-4`}>
                    <RadioButton value={'Card'} color={baseColor} />
                    <CardInfo cardNumber='9302930932023' expiry='01/20' hasRightIcon={false} />
                </View>
        </RadioGroup>

        <View style={tw`flex-row items-center gap-2 my-4`}>
            <Feather name='plus' style={tw`text-ollie-base`} size={24}/>
            <TouchableOpacity style={tw`text-ollie-base poppins`}
            onPress={()=> navigation.navigate('AddCard')}
            >
                <Text>Add Card</Text>
            </TouchableOpacity>
        </View>

        <Button label="Make Payment" poppins style={tw`btn my-8`}/>
        </View>
    )
    }

export default Index