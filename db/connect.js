require("dotenv").config()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 7500

const connect = async(app)=>{
  await mongoose.connect(process.env.url)
  await app.listen(PORT, (err)=>{
      if(err){
        return console.log(err);
      }
      console.log(`listening to ${PORT}`);
  })

}

module.exports = connect