module.exports = app => {
  const mongoose = app.mongoose
  const ConstellationSchema = new mongoose.Schema({
    date: { type: String, }, //日期,
    data: { type: Array  }, 
   
  })

  return mongoose.model('Constellation', ConstellationSchema)
}
