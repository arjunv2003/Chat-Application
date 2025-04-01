import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chats from "./data/data.js"; // Ensure file extension is added
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; // Ensure file extension is added
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js"; // Ensure file extension is added
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import path from "path";
const app = express();
dotenv.config();
connectDB();
app.use(express.json()); // To support JSON-encoded bodies

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-application-nine-jade.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);
// Start the Serverx
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-application-nine-jade.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id;
    console.log(`User ${userData._id} connected`);
    socket.emit("connected");
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  socket.on("typing", (typingInfo) => {
    console.log("Typing event received:", typingInfo);
    // Broadcast typing to the specific chat room
    socket.to(typingInfo.chatId).emit("typing", {
      chatId: typingInfo.chatId,
      userId: typingInfo.userId,
      user: typingInfo.user,
    });
  });

  socket.on("stop typing", (typingInfo) => {
    console.log("Stop typing event received:", typingInfo);
    // Broadcast stop typing to the specific chat room
    socket.to(typingInfo.chatId).emit("stop typing", {
      chatId: typingInfo.chatId,
      userId: typingInfo.userId,
    });
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) {
      console.log("Chat users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
