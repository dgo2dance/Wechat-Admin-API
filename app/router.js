'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller,middleware } = app
  const jwt = middleware.jwt();
  const adminJwt = middleware.jwt({ access:100 })
  router.get('/', controller.home.index)

  // role
  // router.post('/api/role', controller.role.create)
  // router.delete('/api/role/:id', controller.role.destroy)
  // router.put('/api/role/:id', controller.role.update)
  // router.get('/api/role/:id', controller.role.show)
  // router.get('/api/role', controller.role.index)
  router.delete('/api/role', adminJwt,controller.role.removes)
  router.resources('role', '/api/role', adminJwt,controller.role)
  
  // userAccess
  router.post('/api/user/access/register', controller.userAccess.register)
  router.post('/api/user/access/login', controller.userAccess.login)
  router.get('/api/user/access/current', jwt, controller.userAccess.current)
  router.get('/api/user/access/logout', jwt,controller.userAccess.logout)
  router.put('/api/user/access/resetPsw', jwt, controller.userAccess.resetPsw)
  router.put('/api/user/access/resetSelf', jwt, controller.userAccess.resetSelf)

  // user
  // router.post('/api/user', controller.user.create)
  // router.delete('/api/user/:id', controller.user.destroy)
  // router.put('/api/user/:id', controller.user.update)
  // router.get('/api/user/:id', controller.user.show)
  // router.get('/api/user', controller.user.index)
  router.delete('/api/user',adminJwt, controller.user.removes)
  router.resources('user', '/api/user', adminJwt,controller.user)

  //wechat
  router.get('/api/wechat/login', jwt, controller.wechat.login)
  router.get('/api/wechat/friends', jwt, controller.wechat.friends)
  router.get('/api/wechat/rooms', jwt, controller.wechat.rooms)
  router.get('/api/wechat/rooms/members', jwt, controller.wechat.RoomMembers)
  router.get('/api/wechat/rooms/members/add', jwt, controller.wechat.RoomMembersAdd)
}
