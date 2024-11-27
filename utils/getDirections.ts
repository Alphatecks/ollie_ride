type Coordinates = { latitude: number; longitude: number };

export async function getDirections(origin: Coordinates, destination: Coordinates) {
  const GOOGLE_MAPS_API_KEY = "AIzaSyCwiyu1HxfDQFf5A9U4g_m4YLI21EzVuLg"; 
  
  // Replace with your actual Google API key

  console.log("Inside fetch...")
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.routes.length) {
      const route = data.routes[0];

      return {
        distance: route.legs[0].distance.text,
        duration: route.legs[0].duration.text,
        steps: route.legs[0].steps.map((step: any) =>
          step.html_instructions.replace(/<[^>]*>/g, '')
        ),
        polyline: route.overview_polyline.points,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return null;
  }
}

// getDirections({}, {})

// Test the getDirections function with mock coordinates
// (async () => {
//     const origin: Coordinates = { latitude: 40.712776, longitude: -74.005974 }; // Example: New York City, NY
//     const destination: Coordinates = { latitude: 34.052235, longitude: -118.243683 }; // Example: Los Angeles, CA
    
//     const directions = await getDirections(origin, destination);
    
//     if (directions) {
//       console.log("Distance:", directions.distance);
//       console.log("Duration:", directions.duration);
//       console.log("Steps:", directions.steps);
//       console.log("Polyline:", directions.polyline);
//     } else {
//       console.log("Directions could not be retrieved.");
//     }
//   })();




  // https://maps.googleapis.com/maps/api/directions/json?origin=40.712776,-74.005974&destination=34.052235,-118.243683&key=AIzaSyCwiyu1HxfDQFf5A9U4g_m4YLI21EzVuLg