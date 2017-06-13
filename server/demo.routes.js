const express = require('express')
const config = require('./config')
const redis = require('./redis.client')
const co = require('co')
// const sdk = require('./utils.sdk')
const wxpay = require('./utils.pay')

const router = express.Router()
const a = false

router.use(function (req, res, next)   {
  co(function* () {
    const code = req.query.code
    if (code) {
      next()
    } else {
      const _url = `${req.protocol}://${req.headers.host}${req.originalUrl}`
      const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${encodeURIComponent(_url)}&response_type=code&scope=snsapi_base&state=heheda#wechat_redirect`
      res.redirect(authUrl)
    }
    // const _url = `${req.protocol}://${req.headers.host}${req.originalUrl}`
    // const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${encodeURIComponent(_url)}&response_type=code&scope=snsapi_base&state=heheda#wechat_redirect`
    // console.log(authUrl)
    // const userId = req.cookies.userId
    // console.log(isAuth)
    // if (isAuth) {
    //   res.cookie('isAuth', false)
    //   console.log('no')  
    //   next()
    // } else {
    //   res.cookie('isAuth', true)
    //   console.log('yes')
    //   res.redirect(authUrl)
    // }
  })
})

router.get('/jssdk', function (req, res) {
  res.render('jssdk')
})

router.get('/fyb/house/wxpay', function (req, res) {
  co(function* () {
    const code = req.query.code
    if (code) {
      yield wxpay.setUserId(code)
    }
    res.render('wxpay')
  })
})

module.exports = router