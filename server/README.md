# Ollie Ride Matching Service

This folder holds the tiny Node.js service that you can deploy to Render.  
It talks to Firebase using the Admin SDK and will eventually decide which driver should take each trip.

## Structure

```
server/
 ├─ package.json   // node dependencies for the server only
 ├─ src/
 │   └─ index.js   // Express app + Firebase admin bootstrap
 └─ .env.example   // sample environment variables (create this yourself)
```

## Before you run it

1. **Create a Firebase service account key**
   - Firebase console → Project settings → Service accounts → Generate new private key.
   - Store the JSON safely. You don’t commit it.

2. **Set the key as an environment variable**
   - Render (or locally) set `FIREBASE_SERVICE_ACCOUNT_JSON` to the *entire JSON string*.
   - Example `.env` entry:
     ```
     FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
     ```
   - Optional tuning knobs (all optional):
     - `MATCHING_RADIUS_KM` – default `8`
     - `MATCHING_DRIVER_LIMIT` – number of drivers fetched per lookup (default `25`)
     - `MATCHING_MAX_ATTEMPTS` – retries if a driver becomes busy mid-transaction (default `4`)
     - `MATCHING_DEBUG=true` – emit verbose matching logs

3. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Run locally (optional)**
   ```bash
   npm run dev
   ```
   You should see:
   ```
   🚀 Matching service listening on port 4000
   ```

## Deploying on Render

1. Push this project to GitHub (or link the existing repo).
2. On render.com → “New” → “Web Service”.
3. Point it at this repository.
4. Build command: `cd server && npm install`
5. Start command: `cd server && npm start`
6. Configure environment variables:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` – **required**
   - Optional knobs from the list above if you want to tweak behaviour.

Once deployed:
- `/health` returns JSON with service status + instance id.
- `/match-trip` POST `{ tripId }` queues an immediate matching pass.
- The service also watches Firestore for `trips` documents with `status === "TRIP_AVAILABLE"` and automatically assigns the nearest available driver.

