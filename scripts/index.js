var places = require('places.js')
var promisedLocation = require('promised-location')

var $ = s => document.querySelector(s)

var addressFields = [
  '#origin', '#destination',
  '#A1', '#A2', '#A3', '#A4', '#A5',
  '#B1', '#B2', '#B3', '#B4', '#B5',
  '#C1', '#C2', '#C3', '#C4', '#C5',
  '#D1', '#D2', '#D3', '#D4', '#D5',
  '#E1', '#E2', '#E3', '#E4', '#E5',
  '#babyFood1', '#babyFood2',
]

var autocompleters = addressFields.reduce(function (result, id) {
  result[id] = setupAutocomplete(id)
  return result
}, {})

promisedLocation().then(function ({coords: {latitude, longitude}}) {
  autocompleters['#origin'].setVal(latitude + ',' + longitude)
})

$('#autofillDemo').addEventListener('click', function autofillDemo () {
  // https://farm3.static.flickr.com/2778/4134507221_d0c9ec1b7c_o.jpg
  var demoValues = {
    origin: 'Hudson Yards Park',
    destination: '440 Grand St',
    A1: '221-225 8th Ave, 10011', A2: '907 8th Ave, NYC', A3: '289 Columbus Ave, NYC', A4: '25 University Pl, NYC',
    B1: '512 2nd Ave, NYC', B2: '452 W 43rd St., NYC', B3: '1407 Lexington Ave, NYC', B4: '316 Greenwich St, NYC',
    C1: '311 E 23rd St, NYC', C2: '580 9th Ave, NYC', C3: '2704 Broadway, NYC', C4: '5 St. James Pl, NYC',
    D1: '10 Union Sq. East, NYC', D2: '225 W. 57th St, NYC', D3: '609 Columbus Ave, NYC', D4: '2217 7th Ave, NYC',
    babyFood1: '441 West 26th St, NYC',
    babyFood2: '137 East 2nd St, NYC',
  }

  Object.keys(demoValues).forEach(function (id) {
    autocompleters['#' + id].setVal(demoValues[id]);
  });
});

function setupAutocomplete (id) {
  $(id).addEventListener('focus', function () {this.parentElement.classList.add('focused')})
  $(id).addEventListener('blur', function () {this.parentElement.classList.remove('focused')})

  // On Android, don't submit the form when the "Go button" (has an arrow icon on my keyboard) is pressed after filling in a field
  // Instead, just blur the field so that the user can select the next one.
  // TODO automatically focus the next field
  // https://stackoverflow.com/questions/6545086/html-why-does-android-browser-show-go-instead-of-next-in-keyboard/30721284#30721284
  $(id).addEventListener('keypress', function key(event) {
    if (event.charCode == 13 && /Android/.test(navigator.userAgent)) {
      event.preventDefault();
      this.blur()
    }
  })

  return places({
    container: id,
    aroundLatLng: '40.7128,-74.0059',
    aroundRadius: 12875, // 8 miles
    useDeviceLocation: true,
  })
}
