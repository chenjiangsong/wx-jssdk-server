'use strict'

const rp = require('request-promise')
const client = require('./redis')
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
 * sign 
 */
util.getSign = function (params) {
  const stringA = `appid=${config.appid}&body=${params.body}&device_info=WEB&mch_id=${config.mch_id}&nonce_str=${util.createNoncestr()}`
  return MD5.hex(stringA).toUpperCase()
}

/**
 * openId
 */
util.getOpenid = function () {
  
}


module.exports = util