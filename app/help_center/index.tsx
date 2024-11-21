import { View, Text, ExpandableSection, Button } from 'react-native-ui-lib'
import React, {useState} from 'react'
import tw from '@/tailwind'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Headset from "@/assets/Headset.svg"

const Index = () => {

  const [isSelected, setIsSelected] = useState<boolean>(true)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const toggleSelected = () => {
    setIsSelected(!isSelected)
  }

  return (
    <View style={tw`p-3 bg-white flex-1`}>
      <View style={tw`flex-row pt-3`}>
        <Text poppinsMedium style={tw`text-lg  flex-1 text-center border-b border-b-[0.6px] 
          ${isSelected ? "border-ollie-base text-ollie-base": "text-gray-400 border-gray-400"}`}
          onPress = {toggleSelected}
          >FAQs</Text>
        <Text poppinsMedium style={tw`text-lg  flex-1 text-center border-b border-b-[0.6px] 
          ${!isSelected ? "border-ollie-base text-ollie-base": "text-gray-400 border-gray-400"}`}
          onPress = {toggleSelected}
          >Contact Us</Text>
      </View>
      {isSelected && 
      <View style={tw`justify-between flex-1`}>

        <View style={tw`py-6 gap-3`}>

          <View style={tw`border border-[0.5px] px-3 py-1 rounded-md`}>
            <ExpandableSection
              expanded={isExpanded}
              sectionHeader={
              <View style={tw`flex-row justify-between border-gray-400 my-2 py-1 ${isExpanded ? "border-b-[0.5px] " : ""}`} >
                <Text poppinsMedium>What if I can Cancel a ride?</Text>
                {
                  isExpanded ? 
                  <MaterialIcons name="expand-less" size={24} color="gray" />
                  :
                  <MaterialIcons name="expand-more" size={24} color="gray" />
                }
              </View>
              }
              onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text poppins>Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</Text>
            </ExpandableSection>
          </View>

        <View style={tw`border border-[0.5px] px-3 py-1 rounded-md`}>
          <ExpandableSection
            expanded={isExpanded}
            sectionHeader={
            <View style={tw`flex-row justify-between border-gray-400 my-2 py-1 ${isExpanded ? "border-b-[0.5px] " : ""}`} >
              <Text poppinsMedium>How to add new car?</Text>
              {
                isExpanded ? 
                <MaterialIcons name="expand-less" size={24} color="gray" />
                :
                <MaterialIcons name="expand-more" size={24} color="gray" />
              }
            </View>
            }
            onPress={() => setIsExpanded(!isExpanded)}
            >
              <Text poppins>Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</Text>
          </ExpandableSection>
        </View>
      </View>
        <Button label="Live Chat" style={tw`btn poppins`} />
      </View>
      }

      {/* For Contact us if not selected */}
      {!isSelected &&
        <View style={tw`py-6 gap-3`}>
          <View style={tw`border border-[0.5px] px-3 py-1 rounded-md`}>
            <ExpandableSection
              expanded={isExpanded}
              sectionHeader={
              <View style={tw`flex-row justify-between border-gray-400 my-2 py-1 ${isExpanded ? "border-b-[0.5px] " : ""}`} >
                <View style={tw`flex-row gap-2 items-center`}>
                  <Headset />
                  <Text poppinsMedium>Customer Service</Text>
                </View>
                {
                  isExpanded ? 
                  <MaterialIcons name="expand-less" size={24} color="gray" />
                  :
                  <MaterialIcons name="expand-more" size={24} color="gray" />
                }
              </View>
              }
              onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text poppins>Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</Text>
            </ExpandableSection>
            </View>
        </View>
      }
    </View>
  )
}

export default Index