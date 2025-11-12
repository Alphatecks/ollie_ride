const admin = require('firebase-admin');
const serviceAccount = require('../ollie-ride-e8bef-firebase-adminsdk-bmftk-24be19f6d0.json');

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function freeDriversFromOldTrips() {
  try {
    // Get all trips that are completed, canceled, or older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const tripsRef = db.collection('trips');
    const snapshot = await tripsRef
      .where('status', 'in', ['TRIP_COMPLETED', 'TRIP_CANCELED'])
      .get();
    
    console.log(`Found ${snapshot.size} completed/canceled trips\n`);
    
    const driverIdsToFree = new Set();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.driverId) {
        driverIdsToFree.add(data.driverId);
        console.log(`Trip ${doc.id} has driver ${data.driverId}`);
      }
    });
    
    // Also check for old trips (older than 1 hour)
    const oldTripsSnapshot = await tripsRef
      .where('status', '==', 'TRIP_ACCEPTED')
      .get();
    
    oldTripsSnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate();
      if (createdAt && createdAt < oneHourAgo && data.driverId) {
        driverIdsToFree.add(data.driverId);
        console.log(`Old trip ${doc.id} (created ${createdAt}) has driver ${data.driverId}`);
      }
    });
    
    console.log(`\nFreeing ${driverIdsToFree.size} drivers...\n`);
    
    // Free all drivers
    for (const driverId of driverIdsToFree) {
      try {
        const driverRef = db.collection('drivers').doc(driverId);
        await driverRef.update({
          isAvailable: true,
          status: 'AVAILABLE',
          currentTripId: null,
        });
        console.log(`✅ Freed driver ${driverId}`);
      } catch (error) {
        console.error(`❌ Error freeing driver ${driverId}:`, error.message);
      }
    }
    
    console.log('\nDone!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

freeDriversFromOldTrips()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

