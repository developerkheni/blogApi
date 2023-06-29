const authenticateUser = (req, res, next) => {
  if (!req.session.user) {
    throw new Error("user_not_logged_in");
  }
  next();
};

module.exports = authenticateUser;
