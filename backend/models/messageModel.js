const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Corrected typo
      ref: "User", // 'User' model should start with an uppercase letter if it follows convention
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId, // Corrected typo
      ref: "Chat", // Ensure 'Chat' model is correctly referenced
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
