const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  message: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      content: { type: String, required: true },
      time: { type: Date, default: Date.now() },
    },
  ],
  //nhập tiếp mấy attribute vô đây
});

module.exports = mongoose.model("conversation", ConversationSchema);
