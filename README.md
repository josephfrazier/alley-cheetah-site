# alley-cheetah-site

# TODOs / Braindump

* Fix minification
  * [`got` doesn't uglify correctly](https://github.com/sindresorhus/got/issues/89#issuecomment-169742157)
  * It looks like `express-babelify-middleware` should be [running babel with the es2015 preset](https://github.com/luisfarzati/express-babelify-middleware/blob/878ba319d7d85bc0b573a310f6552decba79bde7/lib/index.js#L8-L9) before [`browserify-middleware` runs uglify](https://github.com/ForbesLindesay/browserify-middleware/blob/83a71d24e3cc3f03f7cbf8b9ecab0110d9a22f52/lib/build-response.js#L82), but that seems not to be the case...
  * You can verify that babel before uglify works, as follows
  ```
  babel --presets es2015 node_modules/got/index.js | uglifyjs -cm
  # This doesn't work:
  cat node_modules/got/index.js | uglifyjs -cm
  ```
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
