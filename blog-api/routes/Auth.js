const express = require("express");
const router = express.Router();
const authController = require("../controllers/Auth");
const { validateSignup, validateLogin, validateForgotPassword, validateVerifyOtpAndResetPassword, } = require("../validations/Auth");

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateLogin, authController.login);

router.post("/logout", authController.logout);

router.post( "/forgotPassword", validateForgotPassword, authController.forgotPassword );

router.post( "/verifyOTPandResetPassword", validateVerifyOtpAndResetPassword, authController.verifyOtpAndResetPassword );

module.exports = router;
