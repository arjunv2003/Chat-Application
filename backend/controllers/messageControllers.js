import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid Data Passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  if (!messageId) {
    return res.status(400).json({ message: "Message ID is required" });
  }

  try {
    // Find the message first
    const message = await Message.findById(messageId).populate("chat");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the user is the sender of the message or admin of the group
    const chat = message.chat;
    const isOwner = message.sender.toString() === req.user._id.toString();
    const isGroupAdmin =
      chat.isGroupChat &&
      chat.groupAdmin.toString() === req.user._id.toString();
    const isParticipant = chat.users.includes(req.user._id);

    if (!isOwner && !isGroupAdmin) {
      return res.status(403).json({
        message:
          "You can only delete your own messages or you must be group admin",
      });
    }

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // Update latestMessage if this was the latest message
    if (chat.latestMessage && chat.latestMessage.toString() === messageId) {
      const newLatestMessage = await Message.findOne({ chat: chat._id }).sort({
        createdAt: -1,
      });

      await Chat.findByIdAndUpdate(chat._id, {
        latestMessage: newLatestMessage ? newLatestMessage._id : null,
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      deletedMessageId: messageId,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export { sendMessage, allMessages, deleteMessage };
