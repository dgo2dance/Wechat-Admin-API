
module.exports = appInfo => {
  const config = exports = {}
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://we.blackfe.com'],
  }
  config.cors = {
    credentials: true, 
    origin:['http://we.blackfe.com'],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  return config
}
