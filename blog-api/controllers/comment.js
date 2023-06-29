const Comment = require("../models/comment");
const Blog = require("../models/Blog");

const getCommentsByBlogId = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("blog_not_found");
    }

    if (comments.length > 0) {
      return res.status(200).json(comments);
    }
    throw new Error("comment_not_found");
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { id } = req.session.user;
    const { comment } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error("blog_not_found");
    }

    const newComment = new Comment({
      userId: id,
      blogId,
      comment,
    });

    await newComment.save();

    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.session.user;
    const updatedComment = req.body.comment;

    const comment = await Comment.findById(commentId);
    console.log(comment);
    if (!comment) {
      throw new Error("comment_not_found");
    }

    if (comment.userId.toString() !== userId) {
      throw new Error("forbidden_comment_update");
    }

    comment.updatedAt = new Date();
    comment.comment = updatedComment;

    await comment.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.session.user;
    const blogId = req.params.blogid;

    const comment = await Comment.findById({
      blogId,
      _id: commentId,
      userId,
    });

    if (!comment) {
      throw new Error("comment_not_found");
    }

    if (comment.userId.toString() !== userId) {
      throw new Error("forbidden_comment_delete");
    }

    await comment.deleteOne(comment);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByBlogId,
  addComment,
  updateComment,
  deleteComment,
};
