# alley-cheetah-site

A website that helps find optimal routes for [alley cats](https://en.wikipedia.org/wiki/Alleycat_race) like [Cranksgiving](http://cranksgiving.org/).
It uses the [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/), so you'll need to [get an API key](https://developers.google.com/maps/documentation/directions/get-api-key) to run it.

Usage:

```shell
npm install
export GOOGLE_MAPS_API_KEY=YOUR_API_KEY
export DEBUG=server:*
npm start
```

then open <http://localhost:3000>

# TODOs / Braindump

* Show car routes as well (in case they're faster/shorter than bike routes)
  * Highways/etc should be disabled
  * This will cost extra API calls
* Allow "n choose k" waypoint constraints (maybe require API key?)
* Generate a static map with markers showing all locations?
  * https://developers.google.com/maps/documentation/static-maps/intro#Markers
  * Note that the labels can only be one character, so colors would have to differentiate either rows or columns
* Scrape grocery store addresses and prioritize them in autocomplete?
  * http://supermarketpage.com/supermarketlist.php
  * https://community.algolia.com/places/documentation.html#autocompletejs
* Use OCR to allow easier input?
