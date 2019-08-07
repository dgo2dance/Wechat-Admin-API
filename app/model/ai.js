module.exports = app => {
  const mongoose = app.mongoose
  const AiSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true,unique: true }, //权限
    appId: { type: String, required: true }, //腾讯AI的APPID,
    appKey: { type: String, required: true }, //腾讯AI的密钥
    status: { type: Number, required: true }, //否开启 0关闭 1开启
    startText: { type: String , default:''}, //开启的返回消息
    startKey: { type: String ,  required: true}, //开启的标识
    endKey: { type: String , required: true}, //关闭的标识
    endText: { type: String , default:''}, //关闭的返回消息
    msgKey: { type: String , default:''}, //判断是否AI回复此消息的标识
    ctime: { type: Date, default: Date.now } //创建时间
  })
  return mongoose.model('Ai', AiSchema)
}
