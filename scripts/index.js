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
  const origin = 'Hudson Yards Park'
  const destination = '440 Grand St'

  // https://farm3.static.flickr.com/2778/4134507221_d0c9ec1b7c_o.jpg
  const grid = [
    ['221-225 8th Ave, 10011', '907 8th Ave, NYC', '289 Columbus Ave, NYC', '25 University Pl, NYC'],
    ['512 2nd Ave, NYC', '452 W 43rd St., NYC', '1407 Lexington Ave, NYC', '316 Greenwich St, NYC'],
    ['311 E 23rd St, NYC', '580 9th Ave, NYC', '2704 Broadway, NYC', '5 St. James Pl, NYC'],
    ['10 Union Sq. East, NYC', '225 W. 57th St, NYC', '609 Columbus Ave, NYC', '2217 7th Ave, NYC']
  ]

  const babyFoodStops = [
    '441 West 26th St, NYC',
    '137 East 2nd St, NYC'
  ]

  autocompleters['#origin'].setVal('Hudson Yards Park')
  autocompleters['#destination'].setVal('440 Grand St')

  autocompleters['#A1'].setVal(grid[0][0])
  autocompleters['#A2'].setVal(grid[0][1])
  autocompleters['#A3'].setVal(grid[0][2])
  autocompleters['#A4'].setVal(grid[0][3])

  autocompleters['#B1'].setVal(grid[1][0])
  autocompleters['#B2'].setVal(grid[1][1])
  autocompleters['#B3'].setVal(grid[1][2])
  autocompleters['#B4'].setVal(grid[1][3])

  autocompleters['#C1'].setVal(grid[2][0])
  autocompleters['#C2'].setVal(grid[2][1])
  autocompleters['#C3'].setVal(grid[2][2])
  autocompleters['#C4'].setVal(grid[2][3])

  autocompleters['#D1'].setVal(grid[3][0])
  autocompleters['#D2'].setVal(grid[3][1])
  autocompleters['#D3'].setVal(grid[3][2])
  autocompleters['#D4'].setVal(grid[3][3])

  autocompleters['#babyFood1'].setVal(babyFoodStops[0])
  autocompleters['#babyFood2'].setVal(babyFoodStops[1])
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
    autocompleteOptions: {
      autoselectOnBlur: false,
    },
  })
}
