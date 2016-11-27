const express = require('express')
const router = express.Router()
const alleyCheetah = require('alley-cheetah')
const cachePath = require('path').join(__dirname, '..', 'cache')
const memoize = require('memoize-fs')({ cachePath })

const memoizeFn = memoize.fn

module.exports = router

router.post('/', function (req, res, next) {
  const {origin, destination, eliminateColumns} = req.body
  const babyFoodStops = removeEmptyItems(req.body.babyFoodStops)
  const waypointGrid = removeEmptyCells([
    req.body.rowA,
    req.body.rowB,
    req.body.rowC,
    req.body.rowD,
    req.body.rowE
  ])
  const waypointOptions = {eliminateColumns: eliminateColumns === 'on'}

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
