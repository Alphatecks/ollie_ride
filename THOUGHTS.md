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
##### What have i tried?

- Uninstalled and reinstalled firebase
- Clear expo cache ``` npx expo -c ```
- Restarted server multiple times
- Created a fresh Firebase Project to test it.

##### How I fixed it?

OMO!!! It was MTN and their useless network oo!!! Switched to Airtel and it worked!! Shit was browsing but seems
blocked when accessing Google servers. Useless people!!

