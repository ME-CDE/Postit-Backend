const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {isEmail} = require("validator")

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: [true, "Username can't be empty"],
  },
  email:{
    type:String,
    required:[true, "Email can't be empty"],
    unique:true,
    validate: [isEmail, "Email is invalid"]
  },
  password:{
    type: String,
    minlength:[8,"Minimum length is 8"],
    required: [true, "Password can't be empty"]
  },
  profilePic:{
    type: String,
    default:""
  }
},
{timestamps: true}
)
userSchema.pre('save',  async function(next){
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

module.exports = mongoose.model("user", userSchema)