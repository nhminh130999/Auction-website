const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ItemCategory = require("../Models/Item_Category_model");

router.post("/", (req, res, next) => {
  const category = new ItemCategory({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    ancestors: req.body.ancestors,
  });
  category
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Create category succeeded",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
