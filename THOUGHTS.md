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


Decoded Route Coordinates:  [{"latitude": 5.47891, "longitude": 7.43086}, {"latitude": 5.47884, "longitude": 7.43061}, {"latitude": 5.4788, "longitude": 7.43056}, {"latitude": 5.47866, "longitude": 7.43037}, {"latitude": 5.47858, "longitude": 7.43022}, {"latitude": 5.47843, "longitude": 7.42988}, {"latitude": 5.47825, "longitude": 7.42955}, {"latitude": 5.47827, "longitude": 7.42947}, {"latitude": 5.47837, "longitude": 7.42925}, {"latitude": 5.47841, "longitude": 7.42918}, {"latitude": 5.47837, "longitude": 7.42899}, {"latitude": 5.47838, "longitude": 7.42878}, {"latitude": 5.4779, "longitude": 7.42868}, {"latitude": 5.4775, "longitude": 7.42861}, {"latitude": 5.47731, "longitude": 7.42864}, {"latitude": 5.47688, "longitude": 7.42882}, {"latitude": 5.47626, "longitude": 7.42849}, {"latitude": 5.47559, "longitude": 7.42811}, {"latitude": 5.47557, "longitude": 7.4281}, {"latitude": 5.47557, "longitude": 7.42812}, {"latitude": 5.47549, "longitude": 7.42855}, {"latitude": 5.47541, "longitude": 7.42863}, {"latitude": 5.47524, "longitude": 7.42867}, {"latitude": 5.47502, "longitude": 7.42883}, {"latitude": 5.47498, "longitude": 7.42889}, {"latitude": 5.47478, "longitude": 7.42888}, {"latitude": 5.47474, "longitude": 7.42884}, {"latitude": 5.47467, "longitude": 7.4287}, {"latitude": 5.47466, "longitude": 7.42843}]