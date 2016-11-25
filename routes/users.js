var express = require('express');
var router = express.Router();
var alleyCheetah = require('alley-cheetah');
var cachePath = require('path').join(__dirname, '..', 'cache')
var memoize = require('memoize-fs')({ cachePath: cachePath })

var memoizeFn = memoize.fn

router.post('/', function(req, res, next) {
  var {origin, destination} = req.body;
  var waypointGrid = [
    req.body.rowA,
    req.body.rowB,
    req.body.rowC,
    req.body.rowD,
    req.body.rowE,
  ]

  // remove empty cells
  waypointGrid = waypointGrid.map(row => row.filter(cell => cell.length));
  waypointGrid = waypointGrid.filter(row => row.length);

  alleyCheetah({origin, destination, waypointGrid, memoizeFn}).then(function ({route, waypoints}) {
    var link = alleyCheetah.getMapsLink({origin, destination, waypoints})
    res.send(`<a href=${link}>${link}</a>`);
  }).catch(next)
});

module.exports = router;
