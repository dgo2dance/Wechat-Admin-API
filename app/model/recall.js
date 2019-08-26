module.exports = app => {
  const mongoose = app.mongoose
  const RecallSchema = new mongoose.Schema({
    name: { type: String  },  //名字
    topic: { type: String  }, //群名
    content:{type:String}, //内容
    ctime: { type: Date, default: Date.now } //创建时间
  })

  return mongoose.model('Recall', RecallSchema)
}
