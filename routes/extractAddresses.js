const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const got = require('got')

module.exports = router

router.post('/', function (req, res, next) {
  const {text} = req.body
  const query = querystring.stringify({
    'auth-id': process.env.SMARTYSTREETS_AUTH_ID,
    'auth-token': process.env.SMARTYSTREETS_AUTH_TOKEN,
    aggressive: true
  })
  const headers = {
    'Content-Type': 'text/plain'
  }
  return got('https://us-extract.api.smartystreets.com/', {
    query,
    headers,
    body: text,
    json: true
  }).then(function (response) {
    res.send(response.body)
  }).catch(function (error) {
    console.error(error)
    next(error)
  })
})
