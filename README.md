### Ollie Ride Driver's App


**Prerequisites**

* Node.js and npm (or yarn) installed on your system ([https://nodejs.org/](https://nodejs.org/))

**Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Alphatecks/ollie_ride_driver
   ```

2. **Install Dependencies:**

   Navigate to the project directory and run:

   ```bash
   cd ollie_ride_driver
   npx expo install
   ```


**Firebase Configuration**

1. **Create a Firebase Project:**

   - Head over to the Firebase console ([https://console.firebase.google.com/](https://console.firebase.google.com/)) and create a new project.

2. **Enable Necessary Services:**

   - Essential services for this application include Authentication and a database (Firestore is recommended).

3. **Get Firebase Credentials:**

   - Go to the **Project settings** -> **Your apps** and copy the configuration details for your app. You'll need:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket` (optional)
     - `messagingSenderId` (optional)
     - `appId`
     - `measurementId` (optional)

4. **Update `firebaseConfig.js`:**

   - Locate and open the `firebaseConfig.js`. Replace the placeholder values with your actual Firebase credentials.

**Customization**

1. **App Metadata:**

   - Within `app.json`, modify the following properties to suit your app's identity:
     - `expo.name` (App name displayed in app stores)
     - `expo.slug` (Unique app identifier)
     - `expo.packageName` (Android app package name)

2. **Twrnc Configuration:**

   - You may find a `tailwind.config.js` file for tailoring Twrnc settings (optional).

**Development Server**

1. **Start the Development Server:**

   Run the following command in your terminal to launch the app in a development environment:

   ```bash
   npx expo start
   ```
   OR

   ```bash
   npm start
   ```

   This will open your Expo app in a simulator or device using the Expo Client app.

**Building for Production and Dev with EAS BUILD (Optional)**

1. **Configure EAS Build:**

   Run the command:

   ```bash
   eas build:configure
   ```

   This will set up Expo Application Services (EAS) for building and deploying your app to app stores.

**Remember:**

- **Firebase Security:** Keep your Firebase credentials secure and do not share them publicly.
- **Running on Physical Devices:** For testing on physical devices, you'll need a development build using EAS or alternative approaches like device mirroring.



#### TODOS

- Fix the Keyboard avoiding view not working on upload_car_details.tsx
- Refactor upload_car_details.tsx to show images directly from the image picker instead of uploading first to firebase. [DONE]
- Calculate distance from location to destination using google distance calc API for trips in home bottomsheet
- Implement the rating field to add rating after trip is completed.
- Add functionality to show badge on notification bottom bar icon if there is a notification.
