#### PROBLEM WITH EAS SECRETS FOR GOOGLE MAPS API

I don't know why but refrencing the Google maps api key from the expo secrets server "$GOOGLE_MAPS_API_KEY" doesnt work.
But hardcoding it directly to the app.json and rebuilding works.

This Works: 

``` js
      "config": {
        "googleMaps": {
          "apiKey": "raw_api_key"
          }
      },
 ```
 This doesn't even though "$raw_api_key" was added to expo secrets and also set in .env file
``` js
      "config": {
        "googleMaps": {
          "apiKey": "$raw_api_key"
          }
      },
 ```


 ### ERRORS ENCOUNTERED

Firebase Error:

 ```bash
  [2024-10-15T08:32:48.841Z]  @firebase/firestore: Firestore (10.13.1): WebChannelConnection RPC 'Write' stream 0x85f8e373 transport errored: 
 ```
How I fixed it?






/// REMOVE LATER

const firebaseConfig = {

  apiKey: "AIzaSyDyYIgmy9Vt_z6ydTfzq-Y4M0A9ygEtBC4",

  authDomain: "ollie-ride-7abb8.firebaseapp.com",

  projectId: "ollie-ride-7abb8",

  storageBucket: "ollie-ride-7abb8.appspot.com",

  messagingSenderId: "460810931103",

  appId: "1:460810931103:web:3ba78182dadce210598baa",

  measurementId: "G-QTVFPQTSYQ"

};