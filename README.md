### React-Native-UI-Lib-twrnc-firebase-template

This project is a React Native Expo app featuring:

* **React Native UI Lib:** Streamlined UI components for building responsive interfaces.
* **Expo Fonts:** Easy integration of custom fonts for a polished look.
* **Twrnc:** Tailwind CSS-inspired utility-first framework for rapid styling.
* **Firebase JS SDK:** Seamless integration of Firebase authentication and database services.
* **React Native SVG:** Support for scalable vector graphics for illustrations and icons.
* **Onboarding Screen:** Guided introduction for new users.
* **Auth Screen:** User sign-in and sign-out functionality powered by Firebase.
* **Home Screen:** Home screen with five bottom tabs for organized user interaction.

**Prerequisites**

* Node.js and npm (or yarn) installed on your system ([https://nodejs.org/](https://nodejs.org/))

**Installation**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/sparkle666/rnuilib-twrnc-firebase-template
   ```

2. **Install Dependencies:**

   Navigate to the project directory and run:

   ```bash
   npx expo install
   ```

3. **Set Up Assets:**

   - Copy your logo and splash screen images to the `assets/images` folder. These images will be used for branding and app presentation.

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

   - You may find a `twrnc.config.js` file for tailoring Twrnc settings (optional).

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
