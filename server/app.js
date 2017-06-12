const express = require('express')
const app = express()
const util = require('./util')
const co = require('co')
const config = require('./config')

require('./schedule')

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

app.listen(8082)
