
import axios from 'axios';
import debounce from 'lodash.debounce';

// Modular search function
const search = debounce(async (query) => {
    // Object to store the states (loading, data, error)
  
    const apiKey = process.env.EXPO_BING_MAPS_KEY; // Replace with your actual key
    const countryFilter = 'NG'; // Filter results by country (Nigeria)
  
    const result = {
      loading: true,
      data: [],
      error: null,
    };
    // Lekki Beach Road, Lagos, Lagos State  to Ogbonna Street, Enugu, Enugu State
    // Return early if query is empty
    if (!query.trim()) {
      result.loading = false;
      result.error = 'Search query is empty';
      return result;
    }
  
    // Axios cancellation setup
    const CancelToken = axios.CancelToken;
    let cancel;
  
    const apiUrl = `https://dev.virtualearth.net/REST/v1/Autosuggest?query=${encodeURIComponent(query)}&countryFilter=${countryFilter}&key=${apiKey}`;
    
    try {
      const response = await axios.get(apiUrl, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      });
  
      // Extract and console the formatted addresses if the response is valid
      if (response.status === 200 && response.data.resourceSets) {
        const addresses = response.data.resourceSets[0].resources[0].value.map(item => item.address.formattedAddress);
        
        // console.log(addresses);  // Log the list of formatted addresses
        result.data = addresses; // Store addresses in result data
      } else {
        result.error = response.error || 'Unexpected response structure';
      }
    } catch (error) {
      // Handle errors
      if (axios.isCancel(error)) {
        result.error = 'Request was canceled';
      } else if (error.response) {
        result.error = `Server error: ${error.response.status} - ${error.response.data}`;
      } else if (error.request) {
        result.error = 'No response from server';
      } else {
        result.error = `Error: ${error.message}`;
      }
    } finally {
      result.loading = false; // Stop loading
    }
  
    return result; // Return the result object
  }, 500);
  
  export default search;
  
  
  
  // Modular search function using Google Place Autocomplete
  export const googleSearch = debounce(async (query) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS; // Replace with your Google API key
    const result = {
      loading: true,
      data: [],
      error: null,
    };
  
    // Return early if query is empty
    if (!query.trim()) {
      result.loading = false;
      result.error = 'Search query is empty';
      return result;
    }
  
    // Axios cancellation setup
    const CancelToken = axios.CancelToken;
    let cancel;
  
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:NG&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      });
  
      // Extract and log predictions if the response is valid
      if (response.status === 200 && response.data.predictions) {
        const suggestions = response.data.predictions.map(item => item.description);
        result.data = suggestions; // Store suggestions in result data
  
        console.log(results)
      } else {
        result.error = response.error || 'Unexpected response structure';
      }
    } catch (error) {
      // Handle errors
      if (axios.isCancel(error)) {
        result.error = 'Request was canceled';
      } else if (error.response) {
        result.error = `Server error: ${error.response.status} - ${error.response.data}`;
      } else if (error.request) {
        result.error = 'No response from server';
      } else {
        result.error = `Error: ${error.message}`;
      }
    } finally {
      result.loading = false; // Stop loading
    }
  
    return result; // Return the result object
  }, 500);
  
  
  
  // Modular distance calculation function using Google Distance Matrix API
  export const googleDistanceMatrix = async (origin, destination) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS; // Replace with your Google API key
    const result = {
      loading: true,
      data: null,
      error: null,
    };
  
    // Return early if origin or destination is empty
    if (!origin.trim() || !destination.trim()) {
      result.loading = false;
      result.error = 'Origin or destination is empty';
      return result;
    }
  
    // Axios cancellation setup
    const CancelToken = axios.CancelToken;
    let cancel;
  
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  
    try {
      const response = await axios.get(apiUrl, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      });
  
      // Check if the response is valid and contains distance and duration
      if (response.status === 200 && response.data.rows) {
        const row = response.data.rows[0]; // Get the first row for the origin
        const element = row.elements[0]; // Get the first element for the destination
  
        // Check if the status is OK and extract distance and duration
        if (element.status === 'OK') {
          const { distance, duration } = element;
          result.data = {
            distance: distance.text,
            distanceValue: distance.value,
            duration: duration.text,
            durationValue: duration.value,
          };
        } else {
          result.error = `Error: ${element.status}`;
        }
      } else {
        result.error = response.error || 'Unexpected response structure';
      }
    } catch (error) {
      // Handle errors
      if (axios.isCancel(error)) {
        result.error = 'Request was canceled';
      } else if (error.response) {
        result.error = `Server error: ${error.response.status} - ${error.response.data}`;
      } else if (error.request) {
        result.error = 'No response from server';
      } else {
        result.error = `Error: ${error.message}`;
      }
    } finally {
      result.loading = false; // Stop loading
    }
  
    return result; // Return the result object
  };
  