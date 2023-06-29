const { validate, Joi } = require("express-validation");

const validateCreateBlog = validate({
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
});

const validateUpdateBlog = validate({
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
});

const validateSearchBlogs = validate({
  query: Joi.object({
    keyword: Joi.string().required(),
  }),
});

const validateGetBlogById = validate({
  params: Joi.object({
    blogId: Joi.string().required(),
  }),
});

const validateDeleteBlog = validate({
  params: Joi.object({
    blogId: Joi.string().required(),
  }),
});

module.exports = {
  validateCreateBlog,
  validateUpdateBlog,
  validateSearchBlogs,
  validateGetBlogById,
  validateDeleteBlog,
};
