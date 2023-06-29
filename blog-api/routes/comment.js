const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comment");
const authenticateUser = require("../middlewares/authenticateUser");
const {validateAddComment,
  validateUpdateComment,
  validateDeleteComment,} = require("../validations/comment")

router.get("/blogs/:blogId/comments", commentsController.getCommentsByBlogId);

router.post(
  "/blogs/:blogId/comments",
  authenticateUser,
  validateAddComment,
  commentsController.addComment
);

router.put(
  "/blogs/:blogId/comments/:commentId",
  authenticateUser,
  validateUpdateComment,
  commentsController.updateComment
);

router.delete(
  "/blogs/:blogId/comments/:commentId",
  authenticateUser,
  validateDeleteComment,
  commentsController.deleteComment
);

module.exports = router;
