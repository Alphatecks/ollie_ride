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

#### Firebase Error:

 ```bash
  [2024-10-15T08:32:48.841Z]  @firebase/firestore: Firestore (10.13.1): WebChannelConnection RPC 'Write' stream 0x85f8e373 transport errored: 
 ```
##### What have i tried?

- Uninstalled and reinstalled firebase
- Clear expo cache ``` npx expo -c ```
- Restarted server multiple times
- Created a fresh Firebase Project to test it.

##### How I fixed it?

OMO!!! It was MTN and their useless network oo!!! Switched to Airtel and it worked!! Shit was browsing but seems
blocked when accessing Google servers. Useless people!!

#### Google Maps Not working

##### What i tried?

- Rebuilt app multiple times
- Cleared cache
- Exported Google maps API keys to expo secrets

My app.json looked like:

```json
        "config": {
        "googleMaps": {
          "apiKey": "$raw_api_key_here" // Key from expo secreets
          }
      },
```

##### How I fixed it?

I had to add the API key raw into the app.json google maps config
```json
        "config": {
        "googleMaps": {
          "apiKey": "raw_api_key_here"
          }
      },
```

Using the $ sign didn't work, expo eas was not substituting the secret key.

#### ERROR:  Error adding document:  [TypeError: _firebaseConfig.db.collection is not a function (it is undefined)]

My code:
```javascript
  db.collection('users')
````
##### How I fixed it?

- I was using the Firebase V8 instead of Firebase V9 Modular SDK. Thanks ChatGPT.

Correct code:

```javascript
  const userDocRef = doc(db, 'users', user.uid); // Modular SDK usage
  return onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      console.log('Current data: ', docSnapshot.data());
    } else {
      console.log('No such document!');
    }
  });
```

79% at 5:40pm