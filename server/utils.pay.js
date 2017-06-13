'use strict'

const rp = require('request-promise')
const redis = require('./redis.client')
const config = require('./config')
const co = require('co')
const Hashes = require('jshashes')
const MD5 = new Hashes.MD5
/**
 * 微信支付 统一下单 参数生成步骤
 * 1.nonce_str 随机字符串
 * 2.sign 签名
 *    appid, mch_id, device_info, body, nonce_str 排序后MD5签名 
 * 3.out_trade_no 商户订单号
 * 4.openid 用户标识
 *    1,获取用户userId
 *    2,通过userId转换openId接口 转换成openId
 */

const util = {}

/**
 * 随机字符串 nonce_str 
 */
util.createNoncestr = function (len) {
  len = len || 32
  // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * sign 统一下单sign获取
 */
util.getSign = function (params) {
  let keys = Object.keys(params),
    len = keys.length,
    stringA = ''

  keys.sort();

  for (let i = 0; i < len; i++) {
    stringA += `${keys[i]}=${params[keys[i]]}&`
  }
  stringA += `key=${config.api_key}`
  return MD5.hex(stringA).toUpperCase()
}
/**
 * openId
 */
util.getOpenid = function () {
  return co(function* () {
    const accessToken = yield redis.getAsync('accessToken')
    const userId = yield redis.getAsync('userId')
    const options = {
      method: 'POST',
      uri: `https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=${accessToken}`,
      body: {
        userid: userId
      },
      json: true
    }
    const res = yield rp(options)
    redis.set('openid', res.openid)
    return res.openid
  })
}

util.setUserId = function (code) {
  return co(function* () {
    const accessToken = yield redis.getAsync('accessToken')
    const options = {
      uri: 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo',
      qs: {
        access_token: accessToken,
        code: code
      },
      json: true
    }
    const res = yield rp(options)
    redis.set('userId', res.UserId)
  })
}

util.createOutTradeNo = function () {
  return new Date().getTime()
}

module.exports = util