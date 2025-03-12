import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const DatePickerInput = ({ label = "Date", onDateChange }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange && onDateChange(selectedDate);
    }
  };

  return (
    <View style={tw`border border-gray-300 rounded-lg p-2 flex-row items-center`}> 
      <Text style={tw`text-gray-600 font-semibold mr-2`}>{label}:</Text>
      <TouchableOpacity style={tw`flex-1`} onPress={() => setShow(true)}>
        <TextInput
          style={tw`text-black`}
          value={date.toLocaleDateString()}
          editable={false}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShow(true)}>
        <MaterialIcons name="calendar-today" size={20} color="#1E3A8A" />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePickerInput;
