const { validate, Joi } = require("express-validation");

const validateSignup =  validate({
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: ["com", "in"] } }).required(),
    password: Joi.string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/)
      .required(),
    confirmPassword: Joi.ref("password"),
  }),

});

const validateLogin = validate({
  body: Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "in"] } }).required(),
    password: Joi.string().required(),
  }),
});

const validateForgotPassword = validate({
  body: Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "in"] } }).required(),
  }),
});

const validateVerifyOtpAndResetPassword = validate({
  body: Joi.object({
    email: Joi.string().email({ tlds: { allow: ["com", "in"] } }).required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmNewPassword: Joi.string().required(),
  }),
});

module.exports = {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateVerifyOtpAndResetPassword,
};
