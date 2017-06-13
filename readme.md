# 微信jssdk调试服务器 使用说明

## 安装项目
```
git clone git@github.com:chenjiangsong/wx-jssdk-server.git

cd wx-jssdk-server

npm i
```
## 安装redis

``` 
brew install redis 

//开机启动redis
ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents

//使用launchctl启动redis server 
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

//使用配置文件启动redis server
redis-server /usr/local/etc/redis.conf

//停止redis server的自启动 
launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

//redis 配置文件的位置 
/usr/local/etc/redis.conf

//卸载redis和它的文件 
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist

//测试redis server是否启动 
redis-cli ping
```

## 基本配置

`server/`文件夹新建`config.js`，内容引用`config.template.js`

```js
//config.js
module.exports = {
  appid: '',
  secret: '',
  mch_id: 0,  // 商户号
  api_key: '', // api key

  redis_host: 'localhost',
  redis_port: 6379,
}
```
并将对应企业号/服务号的授权域名绑定到host上

## OK

```
npm start
```