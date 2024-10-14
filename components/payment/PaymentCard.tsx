import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import tw from '@/tailwind';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface PaymentCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;  // React.Node is incorrect, changed to React.ReactNode
  hasArrowIcon?: boolean;
  textStyle: string;
  status: 'empty' | 'review' | 'done'; // Define the possible statuses
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  subtitle,
  href,
  icon,
  hasArrowIcon = true,
  textStyle,
  status,
}) => {
  const router = useRouter();

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
        return ''; // Default or fallback background
    }
  };

  return (
    <TouchableOpacity
      style={tw`flex-row justify-between items-center ${backgroundColor()} rounded-md p-2 py-4`}
      onPress={() => router.push(href)}
    >
      <View style={tw`flex-row items-center gap-3 flex-1`}>
        {icon}
        <View style={tw`gap-2`}>
          <Text poppinsMedium style={tw`${textStyle}`}>
            {title ? title : 'Change Password'}
          </Text>
          
          {status === "empty" && <Text poppins>{subtitle ? subtitle : 'Upload a photo of your driving license'}</Text>}
          {status === "error" && <Text poppins>{subtitle ? subtitle : 'An error occurred please re-upload Payment'}</Text>}
          {status === "done" && ""}
          {status === "review" && <Text poppins style={tw`poppinsItalic`}>Submitted, under review</Text>}
          {!status && <Text poppins >{subtitle}</Text>}
        </View>
      </View>
      {hasArrowIcon && (
        <Feather name="chevron-right" size={24} style={tw`text-gray-600`} />
      )}
    </TouchableOpacity>
  );
};

export default PaymentCard;
