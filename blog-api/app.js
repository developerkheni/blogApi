const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const authRoutes = require("./routes/Auth");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const path = require("path");
const bodyParser = require("body-parser");
const authValidator = require("./validations/Auth");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

dotenv.config();

const port = process.env.PORT;
const dbURL = process.env.DB_URL;
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });

const maxAge = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "prunthilkheni@1234567890",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: maxAge, httpOnly: true },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(morgan('combined'));

app.use(authRoutes);
app.use(blogRoutes);
app.use(commentRoutes);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
