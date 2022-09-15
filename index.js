const express = require("express");
const app = express();
const cors = require("cors")
const connect =  require("./db/connect")
const router = require("./router/userRouter")
const cookieParser = require("cookie-parser");
var whitelist = ['https://postiit.netlify.app', 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials:true,
  exposedHeaders:['Content-Range', 'X-Content-Range'],
  allowedHeaders:['Content-Type', 'Authorization'],
  "preflightContinue": true,

}
// app.use(cors({origin: 'https://postiit.netlify.app', credentials:true, exposedHeaders:['Set-Cookie', 'Date', 'ETag']}))
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.options('*', cors())
app.use(router)
connect(app)