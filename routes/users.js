const express = require('express')
const router = express.Router()
const alleyCheetah = require('alley-cheetah')
const cachePath = require('path').join(__dirname, '..', 'cache')
const memoize = require('memoize-fs')({ cachePath })
const transpose = require('transpose')

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

  alleyCheetah({origin, destination, waypointGrid, waypointOptions, babyFoodStops, memoizeFn}).then(function ({route, waypoints}) {
    const link = alleyCheetah.getMapsLink({origin, destination, waypoints})
    res.send(`<a href=${link}>${link}</a>`)
  }).catch(next)
})

function removeEmptyCells (grid) {
  return removeEmptyItems(grid.map(row => removeEmptyItems(row)))
}

function removeEmptyItems (list) {
  return list.filter(item => item.length)
}
