const mongoose = require("mongoose")


const blogApi= new mongoose.Schema({
  ownerId:{
    type: String,
  },
  title:{
    type:String,
    required: true
  },
  content:{
    type:String,
    required: true
  },
  categories:{
    type:String,
    required: true
  },
  coverImage:{
    type:String,
    default: ''
  },
},
{timestamps: true}
)

module.exports = mongoose.model("blog", blogApi)