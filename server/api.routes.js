const express = require('express')
const co = require('co')
const sdk = require('./utils.sdk')
const wxpay = require('./utils.pay')
const config = require('./config')

const router = express.Router()

/**
 * 微信jssdk 签名
 */
router.get('/getsign', function (req, res) {
  co(function* () {
    const noncestr = sdk.createNoncestr()
    const timestamp = sdk.getTimeStamp()
    
    const params = {
      noncestr: noncestr,
      timestamp: timestamp,
      url: req.query.currentUrl
    }

    const signature = yield sdk.getSignature(params)

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

/**
 * 微信支付
 */
router.get('/getpay', function(req, res) {
  const total_fee = req.query.total_fee
  const defParams = {
    appid: config.appid,
    mch_id: config.mch_id,
    nonce_str: '',
    sign: '',
    body: '微信支付-测试0.01元',
    out_trade_no: '',
    spbill_create_ip: '',
    notify_url: '',
    trade_type: 'JSAPI',
    openid: '',
    total_fee: total_fee
  }
  res.send(wxpay.getSign(defParams))
})

module.exports = router