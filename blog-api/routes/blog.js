const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog");
const authenticateUser = require("../middlewares/authenticateUser");
const upload = require("../middlewares/multer");

const { validateCreateBlog,validateUpdateBlog,validateSearchBlogs,validateGetBlogById,validateDeleteBlog } = require("../validations/blog");

router.get("/allblogs", blogController.getAllBlogs);

router.get("/myblogs", authenticateUser, blogController.getMyBlogs);

router.post( "/createblog", authenticateUser, upload.array("images", 5), validateCreateBlog, blogController.createBlog );

router.get("/blogs/search", validateSearchBlogs, blogController.searchBlogs);

router.get("/blogs/:blogId",validateGetBlogById, blogController.getBlogById);

router.put( "/blogs/:blogId", authenticateUser, upload.array("images", 5), validateUpdateBlog, blogController.updateBlog);

router.delete("/blogs/:blogId",validateDeleteBlog, authenticateUser, blogController.deleteBlog);

module.exports = router;
