'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller,middleware } = app
  const jwt = middleware.jwt();
  router.get('/', controller.home.index)

  // role
  // router.post('/api/role', controller.role.create)
  // router.delete('/api/role/:id', controller.role.destroy)
  // router.put('/api/role/:id', controller.role.update)
  // router.get('/api/role/:id', controller.role.show)
  // router.get('/api/role', controller.role.index)
  router.delete('/api/role', jwt,controller.role.removes)
  router.resources('role', '/api/role', jwt,controller.role)
  
  // userAccess
  router.post('/api/user/access/login', controller.userAccess.login)
  router.get('/api/user/access/current', jwt, controller.userAccess.current)
  router.get('/api/user/access/logout', jwt,controller.userAccess.logout)
  router.put('/api/user/access/resetPsw', app.jwt, controller.userAccess.resetPsw)

  // user
  // router.post('/api/user', controller.user.create)
  // router.delete('/api/user/:id', controller.user.destroy)
  // router.put('/api/user/:id', controller.user.update)
  // router.get('/api/user/:id', controller.user.show)
  // router.get('/api/user', controller.user.index)
  router.delete('/api/user',jwt, controller.user.removes)
  router.resources('user', '/api/user', jwt,controller.user)

  //wechat
  router.get('/api/wechat/login', jwt, controller.wechat.login)
  router.get('/api/wechat/index', jwt, controller.wechat.index)
}
