const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tittle: { type: String, required: true },

  sellerid: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},

  description: String,
  brand: {type: String},
  condition: { type: String, default: "New" },
  photoURLs: {type: String, required: true},
  //category: { type: mongoose.Schema.Types.ObjectId, ref: "item_category" },
  start_bid_amount: { type: Number, required: true },
  time_start: { type: Date, default: Date.now() },
  time_end: { type: Date, default: Date.now() },
  bids: [
    {
      amount: { type: Number },
      time: { type: Date, default: Date.now() },
      bidder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },

  ]

  

});

module.exports = mongoose.model("post", PostSchema);
