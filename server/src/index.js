import 'dotenv/config';
import express from 'express';
import admin from 'firebase-admin';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

let firebaseApp;

const initFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    if (admin.apps.length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        firebaseApp = admin.initializeApp();
      }
    } else {
      firebaseApp = admin.app();
    }

    console.log('✅ Firebase admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase admin SDK:', error.message);
    console.error('Make sure you set FIREBASE_SERVICE_ACCOUNT_JSON env variable with your service account JSON string.');
  }

  return firebaseApp;
};

initFirebase();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Ollie Ride matching service running' });
});

/**
 * Placeholder endpoint that will eventually receive new trip events from the mobile app.
 * For now it only logs the payload so you can confirm Render is receiving requests.
 */
app.post('/match-trip', async (req, res) => {
  const { tripId, riderLatitude, riderLongitude } = req.body || {};

  if (!tripId || typeof riderLatitude !== 'number' || typeof riderLongitude !== 'number') {
    return res.status(400).json({
      error: 'tripId, riderLatitude and riderLongitude are required.',
    });
  }

  console.log('🔎 Received trip request', { tripId, riderLatitude, riderLongitude });

  // TODO: look up nearby drivers in Firestore and assign one to the trip document.
  // This is where you will:
  // 1. Query Firestore for available drivers.
  // 2. Compute distances.
  // 3. Update the trip record with the chosen driver.
  // 4. Send push/SMS notifications if needed.

  res.json({
    status: 'received',
    message: 'Trip request logged. Implement driver matching next.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Matching service listening on port ${PORT}`);
});

