import React, { useState } from 'react';
import { View, Text, Button, TextField, Colors, Avatar } from 'react-native-ui-lib';
import tw from '@/tailwind';

const Profile = () => {
    const [inputValue, setInputValue] = useState('');

    return (
        <View style={tw`bg-white flex-1 p-4`}>
            <View style={tw`items-center`}>
                <Avatar label="IT" badgePosition="TOP_RIGHT" size={100} />
            </View>
            <View style={tw`my-2`}>
                <TextField
                    labelColor="#3C2F3D"
                    placeholder="Full Name"
                    enableErrors
                    validate={['required', (value) => value.length > 6]}
                    validationMessage={['Field is required', 'Name is too short']}
                    hint="Enter Full Name"
                    poppins
                    rounded
                />
                <TextField
                    labelColor="#3C2F3D"
                    placeholder="Email"
                    enableErrors
                    validate={['required', 'email']}
                    style={tw`mt-6`}
                    validationMessage={['Field is required', 'Email is invalid']}
                    hint="Enter Email"
                    poppins
                    rounded
                />
                <TextField
                    labelColor="#3C2F3D"
                    placeholder="Street"
                    enableErrors
                    validate={['required', (value) => value.length > 6]}
                    validationMessage={['Field is required', 'Street name is too short']}
                    hint="Enter Street"
                    poppins
                    rounded
                />
            </View>
            <View style={tw`flex-row gap-x-2`}>
                <Button
                    label="Cancel"
                    backgroundColor={Colors.primaryColor}
                    style={tw`border-[#008955] p-4 flex-1 mt-6`}
                    poppins
                    rounded
                />
                <Button
                    label="Save"
                    backgroundColor={Colors.primaryColor}
                    style={tw`border-[#008955] p-4 flex-1 mt-6`}
                    poppins
                    rounded
                    outline
                />
            </View>
        </View>
    );
};

export default Profile;
