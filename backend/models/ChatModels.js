const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      // Changed from 'chatname' to 'chatName'
      type: String,
      trim: true,
    },
    isGroupChat: {
      // Changed from 'isgroupchat' to 'isGroupChat'
      type: Boolean,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId, // Fixed from 'ObjectIdbject' to 'ObjectId'
        ref: "User", // Ensure this matches your User model
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId, // Fixed from 'ObjectIdbject' to 'ObjectId'
      ref: "Message", // Ensure this matches your Message model
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId, // Fixed from 'ObjectIdbject' to 'ObjectId'
      ref: "User", // Ensure this matches your User model
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema); // Changed from 'chat' to 'Chat'

module.exports = Chat;
