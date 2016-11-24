var express = require('express');
var router = express.Router();
var alleyCheetah = require('alley-cheetah');

router.post('/', function(req, res, next) {
  var {origin, destination} = req.body;
  var waypointGrid = [
    req.body.row1,
    req.body.row2,
    req.body.row3,
    req.body.row4,
    req.body.row5,
  ]

  // remove empty cells
  waypointGrid = waypointGrid.map(row => row.filter(cell => cell.length));
  waypointGrid = waypointGrid.filter(row => row.length);

  alleyCheetah({origin, destination, waypointGrid}).then(function ({route, waypoints}) {
    var link = alleyCheetah.getMapsLink({origin, destination, waypoints})
    res.send(`<a href=${link}>${link}</a>`);
  });
});

module.exports = router;
