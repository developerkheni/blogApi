const User = require("../models/Auth");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const signup = async (req, res, next) => {
  try {
    const existedUser = await User.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }],
    });
    if (existedUser) {
      throw new Error("user_already_exists");
    } else if (req.body.password === req.body.confirmPassword) {
      await User.create(req.body);
      res.status(201).send();
    } else {
      throw new Error("password_not_matched");
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existedUser = await User.findOne({
      email,
    });

    if (existedUser) {
      const matchPassword = await bcrypt.compare(
        password,
        existedUser.password
      );

      if (matchPassword) {
        req.session.user = {
          name: existedUser.name,
          email: existedUser.email,
          id: existedUser._id,
        };
        res.status(200).send();
      } else {
        throw new Error("password_not_matched");
      }
    } else {
      throw new Error("user_not_found");
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((error) => {
      if (error) {
        throw new Error("session_destroy_error");
      } else {
        res.status(200).send();
      }
    });
  } else {
    throw new Error("access_forbidden");
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User_not_found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = Date.now() + 60 * 60 * 1000;

    req.session.otp = otp;
    req.session.otpExpiresAt = otpExpiresAt;
    req.session.email = email;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "prunthilkheni2003@gmail.com",
        pass: "oyvdrrceqxvhgdpg",
      },
    });

    var mailOptions = {
      from: "prunthilkheni2003@gmail.com",
      to: email,
      subject: "OTP",
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error("Email_not_sent");
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send();
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtpAndResetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    const verifyOtp = parseInt(otp);
    const storedOtp = req.session.otp;
    const otpExpiresAt = req.session.otpExpiresAt;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("user_not_found");
    }

    if (verifyOtp !== storedOtp) {
      throw new Error("invalid_otp");
    }

    if (Date.now() > otpExpiresAt) {
      throw new Error("otp_has_expired");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("password_not_matched");
    }
    const isSameAsPrevious = await bcrypt.compare(newPassword, user.password);
    if (isSameAsPrevious) {
      throw new Error("same_as_old_password");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  verifyOtpAndResetPassword,
};
