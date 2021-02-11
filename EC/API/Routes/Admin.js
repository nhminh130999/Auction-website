const express = require("express");
//const app = require('../../app')
const router = express.Router();
const salt = 10;
const bcrypt = require("bcrypt");
const User = require("../Models/User_model");
const mongoose = require("mongoose");
const { route } = require("./Post");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/check_auth");
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "This email is already in the database",
        });
      } else {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return (
              res.status(500),
              json({
                error: err,
              })
            );
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              name: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
              },
              contact: {
                address: req.body.address,
                street: req.body.street,
                city: req.body.city,
                apartment_number: req.body.apartment_number,
                phoneNo: req.body.phoneNo,
              },
            });

            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});
