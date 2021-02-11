const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  name: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
  },
  contact: {
    address: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    apartment_number: String,
    phoneNo: { type: String, required: true },
  },
  feedbacks: [
    {

      critics: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

      rating: { type: Number, min: 1, max: 5, required: true },
      date: { type: Date, default: Date.now() },
      comments: String,
    },
  ],

});

module.exports = mongoose.model("user", UserSchema);



