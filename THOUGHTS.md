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