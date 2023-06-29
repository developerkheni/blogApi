const { ValidationError } = require("express-validation");

const globalErrorHandler = (error, req, res, next) => {
  console.error(error);

  const errorResponses = {
    user_already_exists: {
      statusCode: 409,
      code: "user_already_exists",
      message: "User already exists",
    },
    password_not_matched: {
      statusCode: 401,
      code: "password_not_matched",
      message: "Password does not match",
    },
    user_not_logged_in: {
      statusCode: 401,
      code: "user_not_logged_in",
      message: "User not logged in",
    },
    user_not_found: {
      statusCode: 404,
      code: "user_not_found",
      message: "User not found",
    },
    session_destroy_error: {
      statusCode: 500,
      code: "session_destroy_error",
      message: "Session destroy error",
    },
    access_forbidden: {
      statusCode: 403,
      code: "access_forbidden",
      message: "Access forbidden, user is not logged in",
    },
    otp_has_expired: {
      statusCode: 401,
      code: "otp_has_expired",
      message: "Otp has been expired",
    },
    invalid_otp: {
      statusCode: 401,
      code: "otp_invalid",
      message: "Otp is Invalid",
    },

    same_as_old_password: {
      statusCode: 401,
      code: "same_as_old_password",
      message: "newPassword is same as previoud password",
    },

    blog_not_found: {
      statusCode: 404,
      code: "blog_not_found",
      message: "Blog not found",
    },
    no_matching_blogs: {
      statusCode: 404,
      code: "no_matching_blogs",
      message: "No matching blogs found",
    },
    comment_not_found: {
      statusCode: 404,
      code: "comment_not_found",
      message: "Comment not found",
    },
    forbidden_comment_update: {
      statusCode: 403,
      code: "forbidden_comment_update",
      message: "Access forbidden for update comment",
    },
    forbidden_comment_delete: {
      statusCode: 403,
      code: "forbideen_comment_delete",
      message: "Access forbidden to delete comment",
    },
    validation_failed: {
      statusCode: 403,
      code: "validation_failed",
      message: "Validation is failed",
    },
  };

  const defaultErrorResponse = {
    statusCode: 500,
    message: "Internal Server Error",
  };

  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error);
  }

  const { message } = error;
  const errorResponse = errorResponses[message] || defaultErrorResponse;
  res.status(errorResponse.statusCode).json({
    code: errorResponse.code,
    message: errorResponse.message,
  });
};

module.exports = globalErrorHandler;
