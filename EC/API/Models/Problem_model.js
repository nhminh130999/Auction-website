const mongoose = require("mongoose");

const ProblemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  complainer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("problem", ProblemSchema);
