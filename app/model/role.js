module.exports = app => {
  const mongoose = app.mongoose
  
  const RoleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true  },
    access: { type: Number, required: true,  }, //0为普通用户 ， 100为超级管理员
    extra: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
  })

  return mongoose.model('Role', RoleSchema)
}