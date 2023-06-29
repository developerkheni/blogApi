const { validate, Joi } = require("express-validation");

const validateAddComment = validate({
  params: Joi.object({
    blogId: Joi.string().required(),
  }),
  body: Joi.object({
    comment: Joi.string().required(),
  }),
});

const validateUpdateComment = validate({
  params: Joi.object({
    commentId: Joi.string().required(),
  }),
  body: Joi.object({
    comment: Joi.string().required(),
  }),
});

const validateDeleteComment = validate({
  params: Joi.object({
    blogId: Joi.string().required(),
    commentId: Joi.string().required(),
  }),
});

module.exports = {
  validateAddComment,
  validateUpdateComment,
  validateDeleteComment,
};
