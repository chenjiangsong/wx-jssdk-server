const express = require('express')
const app = express()
const util = require('./server/util')
const co = require('co')
const config = require('./server/config')

require('./server/schedule')
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/jssdk', function (req, res) {
  res.render('jssdk')
})

app.get('/wxpay', function (req, res) {
  res.render('wxpay')
})

const apiRoutes = require('./server/api.routes.js')
app.use('/wxapi', apiRoutes)


app.listen(8120)
