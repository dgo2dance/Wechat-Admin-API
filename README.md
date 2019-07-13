# Wechat-Admin-Api

微信个人账号管理的API，实现微信好友数据分析，好友管理，群聊管理，机器人聊天等功能。

### 框架

* Web框架：Egg,  
* 微信框架：Wechaty,  
* 缓存：redis,  
* 数据库：mongodb  


### 功能清单

- [x] 管理后台
    - [x] 登录注册
    - [x] 权限管理
    - [x] 用户管理
- [x] 微信功能
    - [x] 微信登录
    - [x] 好友管理
        - [x] 好友列表
        - [x] 好友搜索
    - [x] 群聊管理
        - [x] 群聊列表
        - [x] 群聊搜索
        - [x] 获取群友信息
        - [ ] 添加群友
    - [ ] 好友数据分析
    - [ ] 机器人聊天
    - [ ] 数据导出


 


### 下载安装

```bash
$ git clone https://github.com/Guing/Wechat-Admin-API.git
$ cd Wechat-Admin-API
$ PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org npm install --registry=https://registry.npm.taobao.org

```
国内的用户，还是使用npm的淘宝镜像源安装包会快很多。另外由于使用了puppeteer会下载一个chrome内核，会因为下载不稳定导致安装包失败。所以这里指定了puppeteer的下载路径变量：PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org



### 开发

```bash
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```
注意： 在Linux上使用puppeteer引入的chrome内核有可能会出现问题，如果使用centos，要把系统更新到centos7，并且要安装相关的依赖，具体参考这里：[https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)


