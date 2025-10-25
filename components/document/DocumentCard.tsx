import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import tw from '../../tailwind';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface DocumentCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;  // React.Node is incorrect, changed to React.ReactNode
  hasArrowIcon?: boolean;
  textStyle: string;
  status: 'empty' | 'review' | 'done'; // Define the possible statuses
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  subtitle,
  href,
  icon,
  hasArrowIcon = true,
  textStyle,
  status,
}) => {
  const navigation = useNavigation();

  // Determine background color based on status
  const backgroundColor = () => {
    switch (status) {
      case 'empty':
        return 'bg-[#E4C41D30]'; // Red for empty status
      case 'review':
        return 'bg-[#DADADA]'; // Yellow for review status
      case 'done':
        return 'bg-[#E2F5ED]'; // Green for done status
      case 'error':
        return 'bg-[#F4433630]'; // Green for done status
      default:
        return 'bg-gray-200'; // Default or fallback background
    }
  };

  return (
    <TouchableOpacity
      style={tw`flex-row justify-between items-center ${backgroundColor()} rounded-md p-2 py-4`}
      // onPress={() => navigation.navigate(href)}
    >
      <View style={tw`flex-row items-center gap-3 flex-1`}>
        {icon}
        <View style={tw`gap-2`}>
          <Text poppinsMedium style={tw`${textStyle}`}>
            {title ? title : 'Change Password'}
          </Text>
          
          {status === "empty" && <Text poppins>{subtitle ? subtitle : 'Upload a photo of your driving license'}</Text>}
          {status === "error" && <Text poppins>{subtitle ? subtitle : 'An error occurred please re-upload document'}</Text>}
          {status === "done" && ""}
          {status === "review" && <Text poppins style={tw`poppinsItalic`}>Submitted, under review</Text>}
        </View>
      </View>
      {hasArrowIcon && (
        <Feather name="chevron-right" size={24} style={tw`text-gray-600`} />
      )}
    </TouchableOpacity>
  );
};

export default DocumentCard;
