/**
 * 使用node-schedule 启动定时任务
 * 每2个小时 重新获取token
 */
const schedule = require('node-schedule')
const util = require('./util')
const co = require('co')

/**
 * rule : second, minute, hour, day of month, month, day of week
 */
schedule.scheduleJob({ rule: '0 0 */2 * * *' }, () => {
  co(function* () {
    const date = new Date().toString()
    const token = yield util.getToken()
    const ticket = yield util.getTicket(token)
  })
})