const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

//connecting routes
const User = require("./API/Routes/User");
const Post = require("./API/Routes/Post");
const Problem = require("./API/Routes/Problem");

app.use(morgan("dev")); //log activity

//connect to atlas mongodb

mongoose.connect(
  "mongodb+srv://nhminh:minh123@cluster0.ty08s.mongodb.net/auction_ecom?retryWrites=true&w=majority"
);
//add cac thu can thiet cho API
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Redirect cac routes

app.use("/User", User);
app.use("/Post", Post);
app.use("/Problem", Problem);

//handle error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
