import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from "react-native-ui-lib/text";
import { Button, TextField } from 'react-native-ui-lib';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import tw from "@/tailwind";
import { router, useRouter } from 'expo-router';

const RateRider = () => {
	const [reviewRating, setReviewRating] = useState<number>(0); // Track the rating
	const [reviewText, setReviewText] = useState<string>('');

    const router = useRouter()

	// Function to handle star tap
	const handleStarPress = (rating: number) => {
		setReviewRating(rating);
        console.log(reviewRating)
	};

	return (
		<View style={tw`bg-white p-3 flex-1 justify-between`}>
			<View style={tw`my-6 gap-10`}>
				<Text poppinsMedium center p1>How was your trip with Johnson Nweke?</Text>
				<View>
					<Text poppins center style={tw`text-sm`}>Your overall rating</Text>
					<View style={tw`flex-row gap-2 justify-center my-2`}>
						{[1, 2, 3, 4, 5].map((star) => (
							<TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
								<FontAwesome
									name="star"
									size={24}
									color={star <= reviewRating ? "#0C3569" : "#ccc"} // Filled color if selected, gray otherwise
								/>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>

			<View>
				<Text poppins style={tw`text-sm`}>Add Detailed Review</Text>
				<TextField
					style={tw.style("input my-3", { textAlignVertical: 'top' })}
					placeholder="Enter your text here"
					placeholderTextColor="#888"
					value={reviewText}
					onChangeText={setReviewText}
					multiline={true}
					numberOfLines={10}
				/>
			</View>

			<Button
				label="Submit Review"
				poppins
				style={tw`btn`}
				onPress={() => router.push("/riding_flow/download_receipt") }
			/>
		</View>
	);
};

export default RateRider;
