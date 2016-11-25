var places = require('places.js')

document.querySelector('#autofillDemo').addEventListener('click', function autofillDemo () {
  const origin = 'Hudson Yards Park'
  const destination = '440 Grand St'

  // https://farm3.static.flickr.com/2778/4134507221_d0c9ec1b7c_o.jpg
  const grid = [
    ['221-225 8th Ave, 10011', '907 8th Ave, NYC', '289 Columbus Ave, NYC', '25 University Pl, NYC'],
    ['512 2nd Ave, NYC', '452 W 43rd St., NYC', '1407 Lexington Ave, NYC', '316 Greenwich St, NYC'],
    ['311 E 23rd St, NYC', '580 9th Ave, NYC', '2704 Broadway, NYC', '5 St. James Pl, NYC'],
    ['10 Union Sq. East, NYC', '225 W. 57th St, NYC', '609 Columbus Ave, NYC', '2217 7th Ave, NYC']
  ]

  var $ = s => document.querySelector(s)

  $('#origin').value = 'Hudson Yards Park'
  $('#destination').value = '440 Grand St'

  $('#A1').value = grid[0][0]
  $('#A2').value = grid[0][1]
  $('#A3').value = grid[0][2]
  $('#A4').value = grid[0][3]

  $('#B1').value = grid[1][0]
  $('#B2').value = grid[1][1]
  $('#B3').value = grid[1][2]
  $('#B4').value = grid[1][3]

  $('#C1').value = grid[2][0]
  $('#C2').value = grid[2][1]
  $('#C3').value = grid[2][2]
  $('#C4').value = grid[2][3]

  $('#D1').value = grid[3][0]
  $('#D2').value = grid[3][1]
  $('#D3').value = grid[3][2]
  $('#D4').value = grid[3][3]
});

setupAutocomplete('40.7128,-74.0059')

function setupAutocomplete (aroundLatLng) {
  [
    '#origin', '#destination',
    '#A1', '#A2', '#A3', '#A4', '#A5',
    '#B1', '#B2', '#B3', '#B4', '#B5',
    '#C1', '#C2', '#C3', '#C4', '#C5',
    '#D1', '#D2', '#D3', '#D4', '#D5',
    '#E1', '#E2', '#E3', '#E4', '#E5',
  ].forEach(function (id) {
    places({
      container: id,
      aroundLatLng,
      aroundRadius: 12875, // 8 miles
      useDeviceLocation: true,
    })
    document.querySelector(id).addEventListener('focus', function () {this.parentElement.classList.add('focused')})
    document.querySelector(id).addEventListener('blur', function () {this.parentElement.classList.remove('focused')})
  })
}
