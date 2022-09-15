require("dotenv").config()
const user = require("../models/user");
const blogs = require("../models/postApi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleError = (err) => {
  const error = { username: "", email: "", password: "" };
  if (err.code === 11000) {
    error.email = "This email is in use";
  }
  if (err.message === "Invalid email") {
    error.email = err.message;
  }
  if (err.message === "Invalid password") {
    error.password = err.message;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach((errors) => {
      error[`${errors.path}`] = errors.message;
    });
  }
  return error;
};
const createUser = async (req, res) => {
  const { username, email, password, profilePic } = req.body;
  try {
    const newUser = await user.create({
      username,
      email,
      password,
      profilePic,
    });
    res.status(200).json({ newUser, redirect: "/signin" });
  } catch (error) {
    const errors = handleError(error);
    res.json({ errors });
  }
};
const Signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const currentUser = await user.findOne({ email });
    if (currentUser) {
      const hashedPassword = await bcrypt.compare(
        password,
        currentUser.password
      );
      if (hashedPassword) {
        const token = jwt.sign({ id: currentUser._id }, process.env.secret, {
          expiresIn: "24h",
        });
        const time = 24 * 60 * 60 * 1000;
        res.cookie("jwt", token, { maxAge: time , httpOnly: true, SameSite:"none", secure:false });
        return res.status(201).json({ redirect: `/app/${currentUser._id}` });
      }
      throw Error("Invalid password");
    }
    throw Error("Invalid email");
  } catch (error) {
    console.log(error);
    const errors = handleError(error);
    res.status(400).json({ errors });
  }
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    let currentUser = await user.findById(id);
    if(!currentUser){
      return res.status(200).json({redirect:`/error`})
    }
    currentUser = { username: currentUser.username };
    res.status(200).json(currentUser);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed for value")) {
      return res.status(200).json({redirect:`/error`})
    }
  }
};
const auth = async(req, res, next) => {
  const token = req.cookies.jwt;
  const {id} = req.params
  if (token) {
    jwt.verify(token, process.env.secret, (err, decodedtoken) => {
      if (decodedtoken.id != id) {
        return res.json({ redirect: "/signin" });
      }
      if (err) {
        return res.json({ redirect: "/signin" });
      } else {
        next();
      }
    });
  } else {
    return res.json({ redirect: "/signin" });
  }
};
const blogApi = async (req, res) => {
  const { ownerId, title, content, categories, coverImage } = req.body;
  // const token = req.cookies.jwt
  // if (token) {
  //   jwt.verify(token, process.env.secret, (err, decodedtoken)=>{
  //     if (err) {
  //       return res.json({redirect:"/signin"})
  //     }
  //   })
  // }else{
  //   return res.json({redirect:"/signin"})
  // }
  const newBlog = await blogs
    .create({
      ownerId,
      title,
      content,
      categories,
      coverImage,
    })
  res.status(200).json({ newBlog });
};
const getAllBlogs = async(req,res)=>{
  const allBlog = await blogs.find().sort({createdAt : -1})
  const {blog, ownerId, categories,time} = req.query
  if (ownerId) {
    const OwnersBlog = await blogs.find({ownerId:ownerId}).sort({createdAt : -1})
    return res.status(200).json(OwnersBlog)
  }
  if (blog) {
    try {
      const singleBlog = await blogs.findOne({_id:blog})
    if(!singleBlog){
      return res.status(200).json({redirect:`/error`})
    }
    return res.status(200).json(singleBlog)
    } catch (error) {
      if (error.message.includes("Cast to ObjectId failed for value")) {
        return res.status(200).json({redirect:`/error`})
      }
    }
  }
  res.status(200).json(allBlog)
}
const deleteBlog = async(req, res)=>{
  const {blog, ownerId}= req.query
  await blogs.findByIdAndDelete(blog)
  const allUser = await blogs.find({ownerId:ownerId})
  res.status(200).json(allUser)
}
const updateBlog = async(req, res) => {
  const {title, content, categories} = req.body;
  const {ownerId,blog}= req.query
  const user = await blogs.findById(blog)
  user.title = title
  user.content = content
  user.categories = categories
  await user.save()
  res.status(200).json({redirect:`/app/${ownerId}/post`})
};
module.exports = { createUser, Signin, getSingleUser, auth, blogApi, getAllBlogs, updateBlog, deleteBlog};
