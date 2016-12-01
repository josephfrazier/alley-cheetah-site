require('setimmediate') // needed for `got`
const places = require('places.js')
const promisedLocation = require('promised-location')
const got = require('got')

const $ = s => document.querySelector(s)
const $$ = s => Array.from(document.querySelectorAll(s))

// https://farm3.static.flickr.com/2778/4134507221_d0c9ec1b7c_o.jpg
const addressFields = {
  '#origin': 'Hudson Yards Park',
  '#destination': '440 Grand St',

  '#A1': '221-225 8th Ave, 10011',
  '#A2': '907 8th Ave, NYC',
  '#A3': '289 Columbus Ave, NYC',
  '#A4': '25 University Pl, NYC',
  '#A5': '',

  '#B1': '512 2nd Ave, NYC',
  '#B2': '452 W 43rd St., NYC',
  '#B3': '1407 Lexington Ave, NYC',
  '#B4': '316 Greenwich St, NYC',
  '#B5': '',

  '#C1': '311 E 23rd St, NYC',
  '#C2': '580 9th Ave, NYC',
  '#C3': '2704 Broadway, NYC',
  '#C4': '5 St. James Pl, NYC',
  '#C5': '',

  '#D1': '10 Union Sq. East, NYC',
  '#D2': '225 W. 57th St, NYC',
  '#D3': '609 Columbus Ave, NYC',
  '#D4': '2217 7th Ave, NYC',
  '#D5': '',

  '#E1': '',
  '#E2': '',
  '#E3': '',
  '#E4': '',
  '#E5': '',

  '#babyFood1': '441 West 26th St, NYC',
  '#babyFood2': '137 East 2nd St, NYC'
}

const autocompleters = Object.keys(addressFields).reduce(function (result, selector) {
  result[selector] = setupAutocomplete(selector)
  return result
}, {})

restoreFieldValues()

function restoreFieldValues () {
  JSON.parse(window.localStorage.fieldValues || '[]').forEach(function (field) {
    const autocompleter = autocompleters[field.selector]
    if (autocompleter) {
      autocompleter.setVal(field.value)
    } else {
      $(field.selector).checked = field.checked
    }
  })
}

// 'beforeunload' didn't work for me on Android
window.addEventListener('unload', persistFieldValues)

function persistFieldValues () {
  const fieldValues = $$('input').map(function (input) {
    return {
      selector: '#' + input.id,
      value: input.value,
      checked: input.checked
    }
  })
  window.localStorage.fieldValues = JSON.stringify(fieldValues, null, 2)
}

$$('.geolocate').forEach(function (el) {
  const id = '#' + el.dataset.for
  el.addEventListener('click', function (event) {
    const input = $(id)
    input.placeholder = 'Loading...'
    promisedLocation().then(function ({coords: {latitude, longitude}}) {
      input.placeholder = capitalizeFirstLetter(input.name)
      autocompleters[id].setVal(latitude + ',' + longitude)
    }).catch(function (error) {
      input.placeholder = error.message
    })
  })
})

promisedLocation().then(function ({coords: {latitude, longitude}}) {
  autocompleters['#origin'].setVal(latitude + ',' + longitude)
})

$('#clearForm').addEventListener('click', function clearForm () {
  $$('input').forEach(function (input) {
    const selector = '#' + input.id
    const autocompleter = autocompleters[selector]
    if (autocompleter) {
      autocompleter.setVal('')
    }
  })
})

$('#autofillDemo').addEventListener('click', function autofillDemo () {
  Object.keys(addressFields).forEach(function (selector) {
    autocompleters[selector].setVal(addressFields[selector])
  })

  $('[type="submit"]').focus()
  $('[type="submit"]').click()
})

$('form').addEventListener('submit', function (event) {
  event.preventDefault()

  const eliminateRows = $('[name="eliminateRows"]').checked
  const eliminateColumns = $('[name="eliminateColumns"]').checked
  if (!eliminateRows && !eliminateColumns) {
    return window.alert('You have to choose one per row, one per column, or both')
  }

  showResults('Loading...')

  const formData = new window.FormData($('form'))
  const queryString = urlencodeFormData(formData)
  got.post('/users', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: queryString
  }).catch(error => error.response).then(function (response) {
    showResults(response.body)
  })
})

function showResults (innerHTML) {
  $('#results').innerHTML = innerHTML
  $('#results').scrollIntoView({block: 'end', behavior: 'smooth'})
}

// adapted from https://stackoverflow.com/questions/7542586/new-formdata-application-x-www-form-urlencoded/38931547#38931547
function urlencodeFormData (formData) {
  const params = new window.URLSearchParams()
  for (const pair of formData.entries()) {
    if (typeof pair[1] === 'string') {
      params.append(pair[0], pair[1])
    }
  }
  return params.toString()
}

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript/1026087#1026087
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function setupAutocomplete (selector) {
  $(selector).addEventListener('focus', function () {
    if (['origin', 'destination'].includes(this.name)) {
      this.placeholder = capitalizeFirstLetter(this.name)
    }
    this.parentElement.classList.add('focused')
    $('#overlay').classList.add('active')
    this.select()
  })

  $(selector).addEventListener('blur', function () {
    this.parentElement.classList.remove('focused')
    $('#overlay').classList.remove('active')
  })

  // On Android, don't submit the form when the "Go button" (has an arrow icon on my keyboard) is pressed after filling in a field
  // Instead, just blur the field so that the user can select the next one.
  // https://stackoverflow.com/questions/6545086/html-why-does-android-browser-show-go-instead-of-next-in-keyboard/30721284#30721284
  $(selector).addEventListener('keypress', function key (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      getNextInput(this.id).focus()
    }
  })

  return places({
    container: selector,
    aroundLatLng: '40.7128,-74.0059',
    aroundRadius: 12875, // 8 miles
    useDeviceLocation: true
  })
}

function getNextInput (id) {
  const selector = '#' + id
  const selectors = Object.keys(addressFields)
  const index = selectors.indexOf(selector)
  const nextSelector = selectors[index + 1] || '[type="submit"]'
  return $(nextSelector)
}
