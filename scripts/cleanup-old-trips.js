const admin = require('firebase-admin');
const serviceAccount = require('../ollie-ride-e8bef-firebase-adminsdk-bmftk-24be19f6d0.json');

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function cleanupOldTrips() {
  try {
    // Get trips older than 24 hours that are still TRIP_AVAILABLE or TRIP_ACCEPTED
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const tripsRef = db.collection('trips');
    
    // Get all old available/accepted trips
    const oldTripsSnapshot = await tripsRef
      .where('status', 'in', ['TRIP_AVAILABLE', 'TRIP_ACCEPTED'])
      .get();
    
    console.log(`Found ${oldTripsSnapshot.size} active trips\n`);
    
    let freedDrivers = 0;
    let canceledTrips = 0;
    
    for (const doc of oldTripsSnapshot.docs) {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate();
      
      if (createdAt && createdAt < oneDayAgo) {
        console.log(`Canceling old trip ${doc.id} (created ${createdAt})`);
        
        // Free driver if assigned
        if (data.driverId) {
          try {
            const driverRef = db.collection('drivers').doc(data.driverId);
            await driverRef.update({
              isAvailable: true,
              status: 'AVAILABLE',
              currentTripId: null,
            });
            freedDrivers++;
            console.log(`  ✅ Freed driver ${data.driverId}`);
          } catch (error) {
            console.error(`  ❌ Error freeing driver: ${error.message}`);
          }
        }
        
        // Cancel the trip
        try {
          await doc.ref.update({
            status: 'TRIP_CANCELED',
            isCanceled: true,
          });
          canceledTrips++;
        } catch (error) {
          console.error(`  ❌ Error canceling trip: ${error.message}`);
        }
      }
    }
    
    console.log(`\n✅ Freed ${freedDrivers} drivers`);
    console.log(`✅ Canceled ${canceledTrips} old trips`);
    console.log('\nDone!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanupOldTrips()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

