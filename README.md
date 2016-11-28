# alley-cheetah-site

# TODOs / Braindump

* Use a view to make the result page look better: http://expressjs.com/en/4x/api.html#res.render
* Save form values in case user submits early or leaves page
  * https://github.com/guillaumepotier/garlic.js
  * https://github.com/simsalabim/sisyphus
  * Note that the autocomplete boxes will make this tricky (https://github.com/algolia/places/issues/366), so make sure to call setVal ASAP after `<input>.value`s are restored.
* Generate a static map with markers showing all locations?
  * https://developers.google.com/maps/documentation/static-maps/intro#Markers
  * Note that the labels can only be one character, so colors would have to differentiate either rows or columns
* Scrape grocery store addresses and prioritize them in autocomplete?
  * http://supermarketpage.com/supermarketlist.php
  * https://community.algolia.com/places/documentation.html#autocompletejs
* Use speech recognition or OCR to allow easier input?
