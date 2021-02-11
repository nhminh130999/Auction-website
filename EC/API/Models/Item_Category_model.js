const mongoose = require("mongoose");

const ItemCategorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "item_category" }],
});

module.exports = mongoose.model("item_category", ItemCategorySchema);
