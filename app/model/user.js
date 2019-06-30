module.exports = app => {
  const mongoose = app.mongoose
  const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true }, //帐号,
    password: { type: String, required: true }, //密码
    realname: { type: String}, //真名姓名
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, //权限
    phone: { type: String },  //手机号码
    email: { type: String }, //邮箱
    sex: { type: Number }, //性别(0:男,1:女)
    locked: { type: Number }, //(0:正常,1:锁定)
    avatar: { type: String }, //头像
    ctime: { type: Date, default: Date.now } //创建时间
  })
  return mongoose.model('User', UserSchema)
}
