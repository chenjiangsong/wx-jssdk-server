'use strict'

const rp = require('request-promise')
const client = require('./redis')
const config = require('./config')
const co = require('co')
const Hashes = require('jshashes')

const util = {}
/**
 * https://mp.weixin.qq.com/wiki
 * 获取微信jssdk 步骤
 * 1.获取accessToken
 * 2.通过token获取ticket
 * 3.计算签名
 */
util.getToken = function () {
  return co(function* () {
    const options = {
      uri: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
      qs: {
        corpid: config.appid,
        corpsecret: config.secret
      },
      json: true
    }
    const res = yield rp(options)
    if (res && res.access_token) {
      //redis缓存
      const accessToken = res.access_token
      util.setRedis('accessToken', accessToken)
      return accessToken
    } else {
      console.error('ERROR: GET ACCESS_TOKEN ERROR')
    }

  })
}

util.getTicket = function (accessToken) {
  return co(function* () {
    if (!accessToken) {
      accessToken = yield util.getRedisValue('accessToken')
    }
    
    const options = {
      uri: 'https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket',
      qs: {
        access_token: accessToken
      },
      json: true
    }
    
    const res = yield rp(options)
    
    if (res && res.errcode === 0) {
      const ticket = res.ticket
      util.setRedis('ticket', ticket)
      return ticket
    } else {
      console.error('ERROR: GET JSAPI_TICKET ERROR')
    }
  })
}
/**
 * jshash 写签名
 */
util.getSignature = function (params) {
  return co(function* () {
    let token = yield util.getRedisValue('accessToken')
    let ticket = yield util.getRedisValue('ticket')
    
    if (!token) {
      token = yield util.getToken()
    }
    if (!ticket) {
      ticket = yield util.getTicket(token)
    }

    const stringA = `jsapi_ticket=${ticket}&noncestr=${params.noncestr}&timestamp=${params.timestamp}&url=${params.url}`
    return (new Hashes.SHA1).hex(stringA)
  })
}

util.getTimeStamp = function () {
  return Date.parse(new Date())
}

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

util.getRedisValue = function (key) {
  return client.getAsync(key)
}

util.setRedis = function (key, value) {
  client.set(key, value)
}

module.exports = util