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
// Allow Multiple Origins (3000 and 5173)
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

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

// ---------------------------------Deploy----------------------------------

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running successfulli");
//   });
// }

//2nd try

// import { fileURLToPath } from "url";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Detailed Logging
// console.log("Current Environment:", process.env.NODE_ENV);
// console.log("Current Working Directory:", process.cwd());
// console.log("__dirname:", __dirname);

// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "../frontend/dist");

//   console.log("Frontend Absolute Path:", frontendPath);
//   console.log("Frontend Path Exists:", fs.existsSync(frontendPath));

//   // Serve static files
//   app.use(express.static(frontendPath));

//   // Catch-all route to serve index.html
//   app.get("*", (req, res) => {
//     const indexPath = path.join(frontendPath, "index.html");

//     console.log("Serving Index Path:", indexPath);
//     console.log("Index File Exists:", fs.existsSync(indexPath));

//     if (fs.existsSync(indexPath)) {
//       res.sendFile(indexPath);
//     } else {
//       res.status(404).send("Index file not found");
//     }
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running in development mode");
//   });
// }
// ---------------------------------Deploy----------------------------------

app.use(notFound);
app.use(errorHandler);
// Start the Serverx
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: ["http://localhost:3000", "http://localhost:5173"],
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Connected to Socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.userId = userData._id; // Store user ID on socket
//     console.log(`User ${userData._id} connected`);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log(`User joined room: ${room}`);
//   });

//   socket.on("typing", (room) => {
//     // Broadcast typing event to the room with user ID
//     socket.to(room).emit("typing", socket.userId);
//   });

//   socket.on("stop typing", (room) => {
//     // Broadcast stop typing event to the room
//     socket.to(room).emit("stop typing");
//   });

//   socket.on("new message", (newMessageReceived) => {
//     const chat = newMessageReceived.chat;

//     if (!chat.users) {
//       console.log("Chat users not defined");
//       return;
//     }

//     chat.users.forEach((user) => {
//       // Don't send the message back to the sender
//       if (user._id === newMessageReceived.sender._id) return;

//       // Emit to each user's personal room
//       socket.to(user._id).emit("message received", newMessageReceived);
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });

//   socket.off("setup", () => {
//     console.log("User disconnected successfully");
//     socket.leave(userData._id);
//   });
// });

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
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
