import React from 'react';
import { View } from 'react-native';
import Text from 'react-native-ui-lib/text'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import tw from "../../../tailwind"; // TailwindCSS for styling
import Button from 'react-native-ui-lib/button'

interface BookingCancelledProps {
  bookingId: string;
  onPress: () => void;
}

const BookingCancelled: React.FC<BookingCancelledProps> = ({ bookingId, onPress }) => {
  return (
      <View>
          <View style={tw`items-center gap-3`}>
            <FontAwesome name="times-circle" size={100} color="red" />
            <Text poppinsMedium>Booking cancelled successfully</Text>
            <Text poppins center >Your booking with 
            <Text poppinsMedium> ID: {bookingId} </Text>
            has been cancelled successfully.</Text>
          </View>
          <Button label = "Continue" onPress = {onPress} poppins style={tw`btn my-3`}/>
      </View>
  );
};

export default BookingCancelled;
