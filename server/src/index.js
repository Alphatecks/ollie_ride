import 'dotenv/config';
import express from 'express';
import admin from 'firebase-admin';

const app = express();
const PORT = process.env.PORT || 4000;
const MATCHING_RADIUS_KM = Number(process.env.MATCHING_RADIUS_KM || 8);
const DRIVER_RESULT_LIMIT = Number(process.env.MATCHING_DRIVER_LIMIT || 25);
const MAX_MATCH_ATTEMPTS = Number(process.env.MATCHING_MAX_ATTEMPTS || 4);
const SERVICE_INSTANCE_ID =
  process.env.RENDER_INSTANCE_ID || `local-${Math.random().toString(36).slice(2, 8)}`;
const MATCHING_DEBUG = process.env.MATCHING_DEBUG !== 'false'; // Default to true for debugging

app.use(express.json());

let firebaseApp;
let firestore;
let stopTripWatcher;
const processingTrips = new Set();
let tripProcessingDelay = 0; // Delay counter to space out trip processing

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

    firestore = admin.firestore();
    console.log('✅ Firebase admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase admin SDK:', error.message);
    console.error(
      'Make sure you set FIREBASE_SERVICE_ACCOUNT_JSON env variable with your service account JSON string.'
    );
  }

  return firebaseApp;
};

const logDebug = (...args) => {
  if (MATCHING_DEBUG) {
    console.log('[matching:debug]', ...args);
  }
};

const parseNumber = (value) => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const extractLocation = (data = {}) => {
  const candidates = [
    data.currentLocation,
    data.lastKnownLocation,
    data.location,
    data.coords,
    data.gps,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (candidate instanceof admin.firestore.GeoPoint) {
      return {
        latitude: candidate.latitude,
        longitude: candidate.longitude,
      };
    }

    const latitude =
      parseNumber(candidate.latitude ?? candidate.lat ?? candidate._latitude ?? candidate.y) ??
      null;
    const longitude =
      parseNumber(candidate.longitude ?? candidate.lng ?? candidate._longitude ?? candidate.x) ??
      null;

    if (latitude !== null && longitude !== null) {
      return { latitude, longitude };
    }
  }

  const latitude = parseNumber(
    data.latitude ?? data.lat ?? data.lastLatitude ?? data.homeLatitude ?? null
  );
  const longitude = parseNumber(
    data.longitude ?? data.lng ?? data.lastLongitude ?? data.homeLongitude ?? null
  );

  if (latitude !== null && longitude !== null) {
    return { latitude, longitude };
  }

  return null;
};

const toRad = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (origin, destination) => {
  if (!origin || !destination) return null;

  const earthRadiusKm = 6371;

  const dLat = toRad(destination.latitude - origin.latitude);
  const dLon = toRad(destination.longitude - origin.longitude);
  const lat1 = toRad(origin.latitude);
  const lat2 = toRad(destination.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((earthRadiusKm * c).toFixed(2));
};

const formatDriverName = (driverData = {}, driverId = '') => {
  const { displayName, firstName, lastName, full_name: fullName } = driverData;

  if (displayName && displayName.trim()) return displayName.trim();

  const composed = [firstName, lastName]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim();

  if (composed.length > 0) return composed;

  if (typeof fullName === 'string' && fullName.trim().length > 0) return fullName.trim();

  return `Driver ${driverId.slice(0, 6)}`;
};

const buildDriverProfile = (driverId, driverData, location, distanceKm) => {
  const name = formatDriverName(driverData, driverId);
  const phoneNumber =
    driverData.phoneNumber ||
    driverData.phone ||
    driverData.contactNumber ||
    driverData.mobileNumber ||
    null;

  const profileImage =
    driverData.profileImage ||
    driverData.photoURL ||
    driverData.avatarUrl ||
    driverData.avatar ||
    null;

  const carBrand =
    driverData.vehicleBrand ||
    driverData.carBrand ||
    driverData.vehicle?.brand ||
    driverData.vehicle?.make ||
    driverData.vehicleMake ||
    null;

  const carColor =
    driverData.vehicleColor ||
    driverData.carColor ||
    driverData.vehicle?.color ||
    driverData.vehicleColorHex ||
    null;

  const licenseNumber =
    driverData.vehiclePlate ||
    driverData.licenseNumber ||
    driverData.vehicle?.plateNumber ||
    driverData.vehicleRegistration ||
    null;

  return {
    driverId,
    name,
    phoneNumber,
    profileImage,
    carBrand,
    carColor,
    licenseNumber,
    location,
    distanceKm,
  };
};

const findBestDriver = async (trip, excludedDriverIds = new Set()) => {
  if (!firestore) return null;

  const riderLatitude =
    parseNumber(trip.latitude) ?? parseNumber(trip.riderLatitude) ?? parseNumber(trip.pickupLat);
  const riderLongitude =
    parseNumber(trip.longitude) ?? parseNumber(trip.riderLongitude) ?? parseNumber(trip.pickupLng);

  if (riderLatitude === null || riderLongitude === null) {
    console.error('🚫 Trip is missing rider coordinates – cannot perform matching', {
      tripId: trip.id,
    });
    return null;
  }

  const riderLocation = { latitude: riderLatitude, longitude: riderLongitude };

  let queryRef = firestore.collection('drivers').where('isApproved', '==', true);

  // If the `selectedRide` field exists on the trip, try to respect it.
  if (trip.selectedRide) {
    queryRef = queryRef.where('serviceCategories', 'array-contains', trip.selectedRide);
  }

  let snapshot;
  try {
    snapshot = await queryRef.limit(DRIVER_RESULT_LIMIT * 2).get();
    console.log(`🔍 Found ${snapshot.size} drivers from query (isApproved=true${trip.selectedRide ? `, serviceCategories contains ${trip.selectedRide}` : ''})`);
  } catch (error) {
    console.error('❌ Failed to query drivers:', error);
    return null;
  }

  const candidates = [];

  snapshot.forEach((doc) => {
    const driverId = doc.id;
    if (excludedDriverIds.has(driverId)) {
      return;
    }

    const data = doc.data() || {};

    if (data.isAvailable === false || data.status === 'UNAVAILABLE') {
      console.log(`⏭️ Skipping driver ${driverId} – isAvailable=${data.isAvailable}, status=${data.status || 'N/A'}`);
      return;
    }

    const location = extractLocation(data);
    if (!location) {
      console.log(`⚠️ Skipping driver ${driverId} – no location data found. Available fields:`, Object.keys(data));
      console.log(`   Driver data sample:`, JSON.stringify(data, null, 2).substring(0, 500));
      return;
    }

    console.log(`✅ Driver ${driverId} has location:`, location);

    const distanceKm = calculateDistanceKm(riderLocation, location);
    if (distanceKm === null) {
      return;
    }

    candidates.push(buildDriverProfile(driverId, data, location, distanceKm));
  });

  if (!candidates.length) {
    console.log(`🚫 No valid candidates found after filtering. Query returned ${snapshot.size} drivers but none passed filters.`);
    return null;
  }

  console.log(`📊 Found ${candidates.length} valid candidate drivers`);
  candidates.sort((a, b) => a.distanceKm - b.distanceKm);

  const withinRadius = candidates.filter((candidate) => candidate.distanceKm <= MATCHING_RADIUS_KM);
  console.log(`📍 ${withinRadius.length} drivers within ${MATCHING_RADIUS_KM}km radius, ${candidates.length - withinRadius.length} outside radius`);
  
  const selected = withinRadius.length > 0 ? withinRadius[0] : candidates[0];
  console.log(`✅ Selected driver: ${selected.driverId} at ${selected.distanceKm}km`);
  return selected;
};

const assignDriverToTrip = async (tripId, attempt = 0, excludedDriverIds = new Set()) => {
  if (!firestore) {
    throw new Error('Firestore not initialised yet');
  }

  const tripRef = firestore.collection('trips').doc(tripId);

  const tripSnap = await tripRef.get();
  if (!tripSnap.exists) {
    logDebug(`Trip ${tripId} no longer exists – skipping assignment`);
    return { status: 'missing-trip' };
  }

  const trip = tripSnap.data();

  if (trip.driverId || trip.status !== 'TRIP_AVAILABLE') {
    logDebug(`Trip ${tripId} already handled or not available`, {
      driverId: trip.driverId,
      status: trip.status,
    });
    return { status: 'already-assigned' };
  }

  try {
    await tripRef.update({
      matchingStatus: 'PROCESSING',
      matchingInfo: {
        ...(trip.matchingInfo || {}),
        lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
        serviceInstance: SERVICE_INSTANCE_ID,
        attemptNumber: attempt + 1,
      },
    });
  } catch (error) {
    console.error(`❌ Failed to mark trip ${tripId} as PROCESSING:`, error);
    throw error;
  }

  const candidate = await findBestDriver({ ...trip, id: tripId }, excludedDriverIds);

  if (!candidate) {
    await tripRef.update({
      matchingStatus: 'NO_DRIVER_FOUND',
      matchingInfo: {
        ...(trip.matchingInfo || {}),
        lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
        serviceInstance: SERVICE_INSTANCE_ID,
        attemptNumber: attempt + 1,
        note: 'No available drivers matched the criteria',
      },
    });

    console.log(`🚫 No drivers available for trip ${tripId}`);
    return { status: 'no-driver' };
  }

  logDebug(`Candidate driver found for trip ${tripId}`, candidate);

  try {
    const result = await firestore.runTransaction(async (transaction) => {
      const freshTripSnap = await transaction.get(tripRef);
      if (!freshTripSnap.exists) {
        throw new Error('TRIP_GONE');
      }

      const freshTrip = freshTripSnap.data();
      if (freshTrip.driverId || freshTrip.status !== 'TRIP_AVAILABLE') {
        throw new Error('TRIP_ALREADY_ASSIGNED');
      }

      const driverRef = firestore.collection('drivers').doc(candidate.driverId);
      const driverSnap = await transaction.get(driverRef);

      if (!driverSnap.exists) {
        throw new Error('DRIVER_NOT_FOUND');
      }

      const driverData = driverSnap.data();
      if (driverData.isAvailable === false || driverData.currentTripId) {
        throw new Error('DRIVER_BUSY');
      }

      transaction.update(driverRef, {
        isAvailable: false,
        currentTripId: tripId,
        status: 'ASSIGNED',
        lastAssignedTripAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(tripRef, {
        driverId: candidate.driverId,
        driverDisplayName: candidate.name,
        driverPhoneNumber: candidate.phoneNumber || null,
        driverProfileImage: candidate.profileImage || null,
        driverLatitude: candidate.location.latitude,
        driverLongitude: candidate.location.longitude,
        carBrand: candidate.carBrand || null,
        carColor: candidate.carColor || null,
        licenseNumber: candidate.licenseNumber || null,
        status: 'TRIP_ACCEPTED',
        matchingStatus: 'MATCHED',
        matchingInfo: {
          ...(freshTrip.matchingInfo || {}),
          matchedAt: admin.firestore.FieldValue.serverTimestamp(),
          serviceInstance: SERVICE_INSTANCE_ID,
          attemptNumber: attempt + 1,
          distanceKm: candidate.distanceKm,
          driverDocPath: driverRef.path,
        },
      });

      return {
        driverId: candidate.driverId,
        distanceKm: candidate.distanceKm,
      };
    });

    console.log(
      `✅ Assigned driver ${result.driverId} (distance ${result.distanceKm}km) to trip ${tripId}`
    );
    return { status: 'matched', ...result };
  } catch (error) {
    if (error.message === 'DRIVER_BUSY' && attempt + 1 < MAX_MATCH_ATTEMPTS) {
      console.warn(
        `⚠️ Driver ${candidate.driverId} became busy, retrying trip ${tripId} (attempt ${
          attempt + 2
        })`
      );
      excludedDriverIds.add(candidate.driverId);
      return assignDriverToTrip(tripId, attempt + 1, excludedDriverIds);
    }

    if (error.message === 'TRIP_ALREADY_ASSIGNED' || error.message === 'TRIP_GONE') {
      logDebug(`Trip ${tripId} changed while matching: ${error.message}`);
      return { status: 'already-assigned' };
    }

    console.error(`❌ Failed to assign driver to trip ${tripId}:`, error);
    await tripRef.update({
      matchingStatus: 'ERROR',
      matchingInfo: {
        ...(trip.matchingInfo || {}),
        lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
        serviceInstance: SERVICE_INSTANCE_ID,
        attemptNumber: attempt + 1,
        lastError: error.message,
      },
    });
    throw error;
  }
};

const queueTripMatching = (tripId, trigger = 'listener', delay = 0) => {
  if (!tripId) return;
  if (processingTrips.has(tripId)) {
    logDebug(`Trip ${tripId} already processing, skipping duplicate trigger (${trigger})`);
    return;
  }

  processingTrips.add(tripId);
  logDebug(`Queued trip ${tripId} for matching (trigger: ${trigger}, delay: ${delay}ms)`);

  setTimeout(() => {
    assignDriverToTrip(tripId)
      .catch((error) => {
        // Handle quota exceeded errors gracefully
        if (error.message && error.message.includes('RESOURCE_EXHAUSTED')) {
          console.error(`⚠️ Quota exceeded for trip ${tripId}. Skipping to avoid further quota usage.`);
          // Mark trip with error status but don't retry immediately
          if (firestore) {
            const tripRef = firestore.collection('trips').doc(tripId);
            tripRef.update({
              matchingStatus: 'ERROR',
              matchingInfo: {
                lastError: 'Quota exceeded - will retry later',
                lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
              },
            }).catch(() => {
              // Ignore errors updating error status
            });
          }
        } else {
          console.error(`❌ Matching failed for trip ${tripId}:`, error.message);
        }
      })
      .finally(() => {
        processingTrips.delete(tripId);
      });
  }, delay);
};

const startTripWatcher = () => {
  if (!firestore) {
    console.error('Firestore not initialised; skipping trip watcher setup for now.');
    return;
  }

  if (stopTripWatcher) {
    stopTripWatcher();
  }

  stopTripWatcher = firestore
    .collection('trips')
    .where('status', '==', 'TRIP_AVAILABLE')
    .onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const tripId = change.doc.id;
          const data = change.doc.data();

          if (change.type === 'removed') {
            processingTrips.delete(tripId);
            return;
          }

          if (!data) {
            return;
          }

          if (data.driverId) {
            processingTrips.delete(tripId);
            return;
          }

          if (data.matchingStatus === 'PROCESSING') {
            return;
          }

          if (data.matchingStatus === 'MATCHED' || data.matchingStatus === 'ERROR') {
            processingTrips.delete(tripId);
            return;
          }

          // Add small delay between trips to avoid rate limiting (500ms per trip)
          const delay = tripProcessingDelay * 500;
          tripProcessingDelay++;
          queueTripMatching(tripId, change.type, delay);
          
          // Reset delay counter after 10 trips to prevent infinite delay
          if (tripProcessingDelay > 10) {
            tripProcessingDelay = 0;
          }
        });
      },
      (error) => {
        console.error('❌ Trip watcher encountered an error:', error);
        setTimeout(startTripWatcher, 5000);
      }
    );

  console.log('👂 Trip watcher is live – waiting for TRIP_AVAILABLE documents');
};

initFirebase();
startTripWatcher();

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Ollie Ride matching service running',
    serviceInstance: SERVICE_INSTANCE_ID,
  });
});

app.post('/match-trip', async (req, res) => {
  const { tripId } = req.body || {};

  if (!tripId || typeof tripId !== 'string') {
    return res.status(400).json({
      error: 'tripId (string) is required.',
    });
  }

  queueTripMatching(tripId, 'api');
  res.json({
    status: 'queued',
    tripId,
    message: 'Trip matching queued for processing.',
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Matching service listening on port ${PORT} (instance ${SERVICE_INSTANCE_ID})`);
});

const gracefulShutdown = (signal) => {
  console.log(`⚠️ Received ${signal}. Shutting down gracefully...`);
  if (stopTripWatcher) {
    stopTripWatcher();
  }
  server.close(() => {
    console.log('🛑 HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


