const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const browserify = require('browserify-middleware')
const babel = require('babel-core')
const babelPresetEs2015 = require('babel-preset-es2015')
const envify = require('envify')
const httpsRedirect = require('express-https-redirect')
const compression = require('compression')

const index = require('./routes/index')
const users = require('./routes/users')
const extractAddresses = require('./routes/extractAddresses')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(compression())
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets')))
app.use('/images', express.static(path.join(__dirname, 'public', 'images')))
app.use('/scripts/index.js', browserify(path.join(__dirname, 'scripts', 'index.js'), {
  transform: [envify],
  postcompile: function (source) {
    return babel.transform(source, {
      presets: [babelPresetEs2015],
      sourceMaps: "inline"
    }).code
  }
}))

app.use('/', httpsRedirect())
app.use('/', index)
app.use('/users', users)
app.use('/extractAddresses', extractAddresses)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
