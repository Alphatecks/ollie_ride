import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import tw from 'twrnc';

import { ScrollView } from "react-native-gesture-handler";


const ScrollablePicker = ({ 
  data, 
  selectedValue, 
  onValueChange, 
  itemHeight = 40,
  visibleItems = 3 
}) => {
  const scrollViewRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(data.indexOf(selectedValue));

  // Ensure the ScrollView initially shows the selected item
  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * itemHeight,
        animated: false
      });
    }
  }, []);

  // Handle value selection
  const handleValueChange = (value, index) => {
    setSelectedIndex(index);
    onValueChange(value);
    
    // Scroll to keep selected item centered
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * itemHeight,
        animated: true
      });
    }
  };

  // When user stops scrolling, snap to the nearest item
  const handleMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    
    if (index >= 0 && index < data.length && index !== selectedIndex) {
      handleValueChange(data[index], index);
    }
  };

  return (
    <View style={tw`overflow-hidden`}>
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={tw.style({
          paddingVertical: itemHeight * Math.floor(visibleItems / 2)
        })}
        style={tw.style({ height: itemHeight * visibleItems })}

        scrollEventThrottle={16}
        contentInset={{ top: 0, bottom: 0 }}
        alwaysBounceVertical={false}


      >
        {data.map((item, index) => {
          const isSelected = selectedIndex === index;
          
          return (
            <TouchableOpacity
              key={`${item}-${index}`}
              onPress={() => handleValueChange(item, index)}
              style={[
                tw`items-center justify-center`,
                { height: itemHeight }
              ]}
            >
              <Text
                style={[
                  tw`text-center text-lg`,
                  isSelected ? tw`text-blue-600 font-bold` : tw`text-gray-500`
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const TimePicker = ({ 
  initialHour = '03', 
  initialMinute = '30', 
  initialPeriod = 'PM',
  onTimeChange = () => {},
  itemHeight = 40,
  visibleItems = 3
}) => {
  // State for time values
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  // Generate time values
  const hours = Array.from({ length: 12 }, (_, i) => 
    `${(i + 1).toString().padStart(2, '0')}`
  );
  
  const minutes = Array.from({ length: 60 }, (_, i) => 
    `${i.toString().padStart(2, '0')}`
  );
  
  const periods = ['AM', 'PM'];

  // Notify parent component when time changes
  useEffect(() => {
    onTimeChange({ hour, minute, period });
  }, [hour, minute, period]);

  return (
    <View style={tw`border rounded-xl border-blue-100 p-4`}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-gray-500 mr-2`}>Time:</Text>
        
        <View style={tw`flex-row items-center flex-1`}>
          {/* Hour picker */}
          <View style={tw`w-24`}>
            <ScrollablePicker 
              data={hours} 
              selectedValue={hour} 
              onValueChange={setHour}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          </View>
          
          {/* Colon separator */}
          <Text style={tw`text-xl font-bold mx-2`}>:</Text>
          
          {/* Minute picker */}
          <View style={tw`w-24`}>
            <ScrollablePicker 
              data={minutes} 
              selectedValue={minute} 
              onValueChange={setMinute}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          </View>
          
          {/* AM/PM selector */}
          <View style={tw`ml-4`}>
            <TouchableOpacity 
              style={tw`border rounded-md border-blue-200 px-3 py-2`}
              onPress={() => setPeriod(period === 'AM' ? 'PM' : 'AM')}
            >
              <Text style={tw`text-blue-600 font-medium`}>{period}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TimePicker;