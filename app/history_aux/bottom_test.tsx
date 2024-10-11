// import React, { useCallback, useRef, useMemo } from "react";
// import { StyleSheet, View, Text, Button } from "react-native";
// import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";

// const App = () => {
//   // hooks
//   const sheetRef = useRef<BottomSheet>(null);

//   // variables
//   const sections = useMemo(
//     () =>
//       Array(5)
//         .fill(0)
//         .map((_, index) => ({
//           title: `Section ${index}`,
//           data: Array(3)
//             .fill(0)
//             .map((_, index) => `Item ${index}`),
//         })),
//     []
//   );
//   const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

//   // callbacks
//   const handleSheetChange = useCallback((index) => {
//     console.log("handleSheetChange", index);
//   }, []);
//   const handleSnapPress = useCallback((index) => {
//     sheetRef.current?.snapToIndex(index);
//   }, []);
//   const handleClosePress = useCallback(() => {
//     sheetRef.current?.close();
//   }, []);

//   // render
//   const renderSectionHeader = useCallback(
//     ({ section }) => (
//       <View style={styles.sectionHeaderContainer}>
//         <Text>{section.title}</Text>
//       </View>
//     ),
//     []
//   );
//   const renderItem = useCallback(
//     ({ item }) => (
//       <View style={styles.itemContainer}>
//         <Text>{item}</Text>
//       </View>
//     ),
//     []
//   );
//   return (
//     <View style={styles.container}>
//       <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
//       <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
//       <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
//       <Button title="Close" onPress={() => handleClosePress()} />
//       <BottomSheet
//         ref={sheetRef}
//         index={1}
//         snapPoints={snapPoints}
//         onChange={handleSheetChange}
//       >
//         <BottomSheetSectionList
//           sections={sections}
//           keyExtractor={(i) => i}
//           renderSectionHeader={renderSectionHeader}
//           renderItem={renderItem}
//           contentContainerStyle={styles.contentContainer}
//         />
//       </BottomSheet>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 200,
//   },
//   contentContainer: {
//     backgroundColor: "white",
//   },
//   sectionHeaderContainer: {
//     backgroundColor: "white",
//     padding: 6,
//   },
//   itemContainer: {
//     padding: 6,
//     margin: 6,
//     backgroundColor: "#eee",
//   },
// });

// export default App;


import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const App = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = ["25%", "50%", "90%"]

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints = {snapPoints}
        enablePanDownToClose = {true}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default App;