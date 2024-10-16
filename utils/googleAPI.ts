import axios from 'axios';

// Function to fetch nearby places based on user's current location
export const getNearbyPlaces = async (latitude, longitude, radius = 1000, placeType) => {
  const apiKey = 'AIzaSyCwiyu1HxfDQFf5A9U4g_m4YLI21EzVuLg';

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const params = {
    location: `${latitude},${longitude}`,
    radius: radius,
    key: apiKey,
  };

  // Add place type parameter if provided
  if (placeType) {
    params.type = placeType;
  }

  console.log(`URL: ${baseUrl}?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}${placeType ? `&type=${placeType}` : ''}`); // For debugging

  try {
    const response = await axios.get(baseUrl, { params });
    const places = response.data.results;

    // Format the data to match your ridersData structure
    const formattedPlaces = places.map((place, index) => ({
      id: index + 1,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      fromLocation: place.name,
      toLocation: place.vicinity,
      fullName: place.name,
      phoneNumber: place.formatted_phone_number || 'Unknown', // Not provided in your response
      time: new Date().toLocaleTimeString(),
    }));
    
    // console.log("List of all places: ", formattedPlaces);

    return formattedPlaces;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};
