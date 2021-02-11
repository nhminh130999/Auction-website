const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  buyerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  sellerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: { type: Date, default: Date.now() },
  itemid: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
  payment_amount: { type: Number, required: true },
});

module.exports = mongoose.model("invoice", InvoiceSchema);
