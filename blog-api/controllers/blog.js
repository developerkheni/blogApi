const Blog = require("../models/Blog");
const Comment = require("../models/comment");
const User = require("../models/Auth");
const path = require("path");
const fs = require("fs");

const createBlog = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.session.user.id;
    const images = req.files.map((file) => file.path);

    const blog = await Blog.create({
      title,
      description,
      userId,
      images,
    });

    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getMyBlogs = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const blogs = await Blog.find({ userId }).sort({ createdDate: -1 });
    res.send(blogs);
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdDate: -1 });
    res.send(blogs);

    if (!blogs.length > 0) {
      throw new Error("blogs_not_found");
    }
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      throw new Error("blog_not_found");
    }

    const comments = await Comment.aggregate([
      { $match: { blogId: blog._id } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user: "$user.name",
          comment: 1,
        },
      },
    ]);

    res.send({ blog, comments });
  } catch (error) {
    next(error);
  }
};

const searchBlogs = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      throw new Error("no_matching_blogs");
    }

    const blogs = await Blog.find({
      title: { $regex: keyword, $options: "i" },
    });

    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const { title, description } = req.body;
    const userId = req.session.user.id;
    const blogImages = req.files.map((file) => file.path);

    const blog = await Blog.findOne({ _id: blogId, userId });
    const oldImages = blog.images;

    if (!blog) {
      throw new Error("blog_not_found");
    }

    blog.title = title;
    blog.description = description;
    blog.images = blogImages;

    await blog.save();

    oldImages.forEach((image) => {
      if (!blogImages.includes(image)) {
        fs.unlinkSync(image);
      }
    });

    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.session.user.id;

    const blog = await Blog.findOneAndDelete({ _id: blogId, userId });
    if (!blog) {
      throw new Error("blog_not_found");
    }

    const oldImages = blog.images;
    oldImages.forEach((image) => {
      fs.unlinkSync(image);
    });

    await Comment.deleteMany({ blogId });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getMyBlogs,
  getAllBlogs,
  getBlogById,
  searchBlogs,
  updateBlog,
  deleteBlog,
  Blog,
};
