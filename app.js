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

app.get('/getsign', function (req, res) {
  co(function* () {
    const noncestr = util.createNoncestr()
    const timestamp = util.getTimeStamp()
    
    const params = {
      noncestr: noncestr,
      timestamp: timestamp,
      url: req.query.currentUrl
    }

    const signature = yield util.getSignature(params)

    res.send({
      status: 1,
      msg: 'ok',
      data: {
        appId: config.appid,
        timestamp: timestamp,
        nonceStr: noncestr,
        signature: signature
      }
    })
  })
})

app.listen(8120)
