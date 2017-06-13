const express = require('express')
const co = require('co')
const cookie = require('cookie-parser')
const config = require('./server/config')

const app = express()

require('./server/schedule')
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(cookie())
// app.get('/', function (req, res) {
//   res.render('index')
// })
const demoRoutes = require('./server/demo.routes')
const apiRoutes = require('./server/api.routes')
app.use('/fybWeixinEnt', demoRoutes)
app.use('/wxapi', apiRoutes)

app.listen(8120)
