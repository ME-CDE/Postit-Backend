const router = require("express").Router()
const {createUser, Signin, getSingleUser, auth, blogApi, getAllBlogs, updateBlog, deleteBlog} = require("../controller/userController")

router.post("/signup", createUser)
router.post("/signin", Signin)
router.get("/app/:id",auth, getSingleUser)
router.get("/readmore/:id",getSingleUser)
router.post("/:id/blogs", blogApi)
router.get("/blogs", getAllBlogs)
router.delete("/blogs", deleteBlog)
router.patch("/blogs", updateBlog)

module.exports= router