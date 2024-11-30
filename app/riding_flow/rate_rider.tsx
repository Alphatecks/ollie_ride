import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from "react-native-ui-lib/text";
import { Button, TextField } from 'react-native-ui-lib';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import tw from "@/tailwind";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Toast from 'react-native-toast-message';
import ButtonLoader from '@/components/general/ButtonLoader';

const RateRider = () => {
    const [reviewRating, setReviewRating] = useState<number>(0); // Track the rating
    const [reviewText, setReviewText] = useState<string>('');
    const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false)

	const params = useLocalSearchParams()

	console.log(params)

    // Log updated review rating
    useEffect(() => {
        console.log("Updated rating:", reviewRating);
    }, [reviewRating]);

    // Function to handle star tap
    const handleStarPress = (rating: number) => {
        if (rating >= 1 && rating <= 5) {
            setReviewRating(rating);
        }
    };

	const handleSubmitReview = async() => {
		setLoading(true)
		try{
			const selectedTripRef = doc(db, "trips", params.id)
			await updateDoc(selectedTripRef, {rating: reviewRating, reviewMessage: reviewText})
			Toast.show({
				type: "success",
				text1: "You rated the trip!!"
			})
			setLoading(false)
			router.push({
				pathname: "/riding_flow/download_receipt",
				params: params
			})
		}
		catch(e){
			setLoading(false)
			Toast.show({
				type: "error",
				text1: `An error occured ${e}`
			})
		}
	}

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
			
			{loading ? 
			<ButtonLoader />
			:
            <Button
                label="Submit Review"
                poppins
                style={tw`btn`}
                disabled={reviewRating === 0 || reviewText.trim() === ''}
                onPress={handleSubmitReview}
            />
			}
        </View>
    );
};

export default RateRider;
