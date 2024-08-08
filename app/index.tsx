import { Text, View } from "react-native";
import { Button } from '@rneui/themed';
import tw from 'twrnc';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this.</Text>
      <Button title="Solid" />
      <View style = {tw`w-20 h-20 bg-red-200`}></View>
    </View>
  );
}
