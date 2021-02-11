const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Problem = require("../Models/Problem_model");
const auth = require("../Middleware/check_auth");

router.post("/", auth, (req, res, next) => {
  const problem = new Problem({
    _id: mongoose.Types.ObjectId(),
    complainer: req.userData.userid,
    title: req.body.title,
    description: req.body.description,
  });
  problem
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Problem has been sent.",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.get("/", auth, (req, res, next) => {
  Problem.find({ complainer: req.userData.userid })
    .exec()
    .then((docs) => {
      res.status(200).json({
        message: "These are the complaints that you have made.",
        counts: docs.length,
        problems: docs.map((doc) => {
          return {
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            date: doc.date,
          };
        }),
      });
    })
    .catch();
});

module.exports = router;
