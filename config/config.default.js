
module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513779989145_1674'

  // add your config here
  // 加载 errorHandler 中间件
  config.middleware = ['errorHandler']

  // 只对 /api 前缀的 url 路径生效
  // config.errorHandler = {
  //   match: '/api',
  // }

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:8080'],
  }
  config.cors = {
    credentials: true, 
    origin:['http://localhost:8080'],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.multipart = {
    fileExtensions: ['.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov'], // 增加对 .apk 扩展名的支持
  },

    config.bcrypt = {
      saltRounds: 10 // default 10
    }

  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/wechat',
    options: {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  }
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0
    }
  }
  config.jwt = {
    secret: 'Great4-M',
    enable: true, // default is false
    match: '/jwt', // optional
  }
  config.i18n = {
    // 默认语言，默认 "en_US"
    defaultLocale: 'zh-CN',
    // URL 参数，默认 "locale"
    queryField: 'locale',
    // Cookie 记录的 key, 默认："locale"
    cookieField: 'locale',
    // Cookie 的 domain 配置，默认为空，代表当前域名有效
    cookieDomain: '',
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: '1y',
  }

  config.bizerror = {
    breakDefault: false, // disable default error handler
    sendClientAllParams: false, // return error bizParams to user
    interceptAllError: false, // handle all exception, not only bizError exception
  }
  config.joi = {
    options: {},
    locale: {
      'zh-cn': {
        any: {
          required: '是必须的',

        },
        string: {
          min: '最小为{{limit}}位',
          max: '最大为{{limit}}位',
          regex: {
            base: '格式不正确'
          },
          email: '格式不正确'
        },
        number: {
          base: '必须为数字',
          min: '最小为{{limit}}',
          max: '最大为{{limit}}'
        }
      }
    },
    throw: true, // throw immediately when capture exception
    throwHandle: (error) => { return error }, // error message format when throw is true
    errorHandle: (error) => { return error }, // error message format when throw is false
    resultHandle: (result) => { return { result } } // fromat result
  }
  config.app = {
    tokenExpire: 3600*24
  }
  config.wechat = {
    loginUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=',
    tencentAi: {
      appId: '2117405317',
      appKey: 'cf2rk3HHzm1nLRPA',
      startText:'开启机器人聊天。在消息开头加上小黑，则机器人会自动回复。若想关闭，请回复，回家吧小黑',
      startKey:'出现吧小黑',
      endKey:'回家吧小黑',
      endText:'机器人聊天模式已经关闭',
      msgKey:'小黑'
      
    }
  }
  return config
}
