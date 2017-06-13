'use strict'

const express = require('express')
const co = require('co')
const sdk = require('./utils.sdk')
const wxpay = require('./utils.pay')
const config = require('./config')
const parser = require('xml2json')
const rp = require('request-promise')

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
  co(function* () {
    const total_fee = req.query.total_fee || 1
    const options = {
      appid: config.appid,
      mch_id: config.mch_id,
      nonce_str: wxpay.createNoncestr(),
      body: `微信支付-测试${total_fee}分`,
      out_trade_no: wxpay.createOutTradeNo(),
      spbill_create_ip: '127.0.0.1',
      notify_url: 'http://wxpay.weixin.qq.com/pub_v2/pay/notify.v2.php',
      trade_type: 'JSAPI',
      total_fee: total_fee
    }
    options.openid = yield wxpay.getOpenid()
    
    options.sign = wxpay.getSign(options)
    const xml = getOrderXMLParams(options)

    const orderRes = yield rp({
      uri: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      method: 'POST',
      headers: {
        'content-type': 'application/xml; charset=utf8'
      },
      body: xml
    })
    const orderData = JSON.parse(parser.toJson(orderRes)).xml
    const payData = {
      appId: orderData.appid,
      nonceStr: wxpay.createNoncestr(),
      package: 'prepay_id=' + orderData.prepay_id,
      signType: 'MD5',
      timeStamp: new Date().getTime() + ''
    }
    payData.paySign = wxpay.getSign(payData)
    console.log(payData)
    res.send(payData)
  })
})

function sortObjectKeys (obj) {
  let keys = Object.keys(obj),
    len = keys.length,
    orderedObj = {}

  keys.sort();

  for (let i = 0; i < len; i++) {
    orderedObj[keys[i]] = obj[keys[i]]
  }
  return orderedObj
}

function getOrderXMLParams (params) {
  let orderParams = sortObjectKeys(params),
    xml = ''

  for (let key in orderParams) {
    xml += `    <${key}>${orderParams[key]}</${key}>\n`
  }
  xml = `<xml>\n${xml}</xml>`
  return xml
}



module.exports = router