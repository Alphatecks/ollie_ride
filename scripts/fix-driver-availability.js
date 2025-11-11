const admin = require('firebase-admin');
const serviceAccount = require('../ollie-ride-e8bef-firebase-adminsdk-bmftk-24be19f6d0.json');

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function fixDriverAvailability(driverId) {
  try {
    const driverRef = db.collection('drivers').doc(driverId);
    
    await driverRef.update({
      isAvailable: true,
      status: 'AVAILABLE', // or delete this field if you don't use it
      currentTripId: null, // Clear any assigned trip
    });
    
    console.log(`✅ Fixed driver ${driverId} - set to available`);
  } catch (error) {
    console.error(`❌ Error fixing driver ${driverId}:`, error.message);
  }
}

// Get driver ID from command line
const driverId = process.argv[2];

if (!driverId) {
  console.log('Usage: node scripts/fix-driver-availability.js <DRIVER_ID>');
  console.log('Example: node scripts/fix-driver-availability.js MCmgIWmqpPg3T5BNJpIyZtjjVDB3');
  process.exit(1);
}

fixDriverAvailability(driverId)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

