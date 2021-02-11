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
  console.log("req body"+req.body)
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
              res.status(500).
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
router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((user) => {
      console.log(user);
      res.status(200).json(
        user.map((x) => {
          return {
            email: x.email,
            name: x.name,
            contact: x.contact,
            feedback: x.feedback,
          };
        })
      );
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/login", (req, res, next) => {
  console.log("login"+req.body)
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Login Failed",
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userid: user._id,
            },
            "secret",
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({

            message: "Login Success, Token exprired in one hour.",

            token: token,
          });
        }
        return res.status(401).json({
          message: "Login Failed",
        });
      });
    })

    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

});
router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (result) {
          User.deleteOne({ _id: id }, (err) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            }
            return res.status(200).json({
              message: "User deleted",
            });
          });
        }
        return res.status(401).json({
          message: "Password not correct.",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
router.post("/:userid/feedback", auth, (req, res, next) => {
  const id = req.params.userid;
  // if (id == req.userData._id) {
  //   return res.status(401).json({
  //     error: "you can't give yourself a rating ",
  //   });
  // }
  User.findById(id)
    .exec()
    .then((user) => {
      console.log(user);
      user.feedbacks.push({
        critics: req.userData.userid,
        rating: req.body.rating,
        comments: req.body.comments,
      });
      return user.save();
    })
    .then((doc) => {
      res.status(201).json({
        message: "Your feedback have been noted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;