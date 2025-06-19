import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

export const leaveGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroupChat) {
      return res
        .status(400)
        .json({ message: "Cannot leave a one-on-one chat" });
    }

    if (!chat.users.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    if (
      chat.groupAdmin.toString() === req.user._id.toString() &&
      chat.users.length > 1
    ) {
      const newAdmin = chat.users.find(
        (userId) => userId.toString() !== req.user._id.toString()
      );
      chat.groupAdmin = newAdmin;
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: req.user._id },
        ...(chat.groupAdmin.toString() === req.user._id.toString() &&
        chat.users.length > 1
          ? {
              groupAdmin: chat.users.find(
                (userId) => userId.toString() !== req.user._id.toString()
              ),
            }
          : {}),
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (updatedChat.users.length === 0) {
      await Chat.findByIdAndDelete(chatId);
      await Message.deleteMany({ chat: chatId });
      return res
        .status(200)
        .json({ message: "Group deleted as no members left" });
    }

    res.status(200).json({
      message: "Successfully left the group",
      chat: updatedChat,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const clearChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    // Find the chat first
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is a participant in the chat
    if (!chat.users.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    // For group chats, only admin can clear chat
    if (
      chat.isGroupChat &&
      chat.groupAdmin.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only group admin can clear the chat" });
    }

    // Delete all messages in the chat
    const deletedMessages = await Message.deleteMany({ chat: chatId });

    // Update the chat's latestMessage to null
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: null,
    });

    res.status(200).json({
      message: "Chat cleared successfully",
      deletedCount: deletedMessages.deletedCount,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check permissions
    if (chat.isGroupChat) {
      // Only group admin can delete group chat
      if (chat.groupAdmin.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Only group admin can delete the group" });
      }
    } else {
      // For one-on-one chats, user must be a participant
      if (!chat.users.includes(req.user._id)) {
        return res
          .status(403)
          .json({ message: "You are not a participant in this chat" });
      }
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      message: chat.isGroupChat
        ? "Group deleted successfully"
        : "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

export default {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup,
  clearChat,
  deleteChat,
};
