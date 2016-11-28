const express = require('express')
const router = express.Router()
const alleyCheetah = require('alley-cheetah')
const cachePath = require('path').join(__dirname, '..', 'cache')
const memoize = require('memoize-fs')({ cachePath })
const transpose = require('transpose')
const prettyMs = require('pretty-ms')

const memoizeFn = memoize.fn

module.exports = router

router.post('/', function (req, res, next) {
  const {origin, destination} = req.body
  let eliminateRows = req.body.eliminateRows === 'on'
  let eliminateColumns = req.body.eliminateColumns === 'on'
  const babyFoodStops = removeEmptyItems(req.body.babyFoodStops)
  let waypointGrid = [
    req.body.rowA,
    req.body.rowB,
    req.body.rowC,
    req.body.rowD,
    req.body.rowE
  ]
  if (!eliminateRows && !eliminateColumns) {
    return res.send('You have to choose one per row, one per column, or both')
  } else if (!eliminateRows && eliminateColumns) {
    waypointGrid = transpose(waypointGrid)
    eliminateColumns = false
    eliminateRows = true
  }
  waypointGrid = removeEmptyCells(waypointGrid)
  const waypointOptions = {eliminateColumns}

  alleyCheetah.getOptimizedRoutes({origin, destination, waypointGrid, waypointOptions, babyFoodStops, memoizeFn}).then(function (routeWaypointPairs) {
    const routeSortKeys = ['distance', 'duration']
    let responseBody = '<ul>'
    const offsets = {'Shortest': 0, 'Longest': -1}
    Object.keys(offsets).forEach(function (description) {
      routeSortKeys.forEach(function (routeSortKey) {
        const sorted = alleyCheetah.sortRoutesBy({routeWaypointPairs, routeSortKey})
        const offset = offsets[description]
        const index = (offset + sorted.length) % sorted.length
        const {route, waypoints} = sorted[index]

        const distance = alleyCheetah.getLegsTotal({route, property: 'distance'})
        const humanizedDistance = metersToMiles(distance).toFixed(2) + ' miles'

        const duration = alleyCheetah.getLegsTotal({route, property: 'duration'})
        const humanizedDuration = prettyMs(1000 * duration)

        const link = alleyCheetah.getMapsLink({origin, destination, waypoints})
        responseBody += `<li>${description} ${routeSortKey} (${humanizedDistance}, ${humanizedDuration}): <a href=${link}>${link}</a></li>`
      })
    })
    responseBody += '</ul>'
    res.send(responseBody)
  }).catch(next)
})

function removeEmptyCells (grid) {
  return removeEmptyItems(grid.map(row => removeEmptyItems(row)))
}

function removeEmptyItems (list) {
  return list.filter(item => item.length)
}

function metersToMiles (meters) {
  const milesPerMeter = 0.000621371
  return meters * milesPerMeter
}
