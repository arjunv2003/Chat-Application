import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

const MessageInput = ({ selectedChat, user, onSendMessage, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const typingTimeoutRef = useRef(null);

  // Ensure socket is available before setting up
  useEffect(() => {
    return () => {
      // Clear any existing timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedChat]);

  const handleTyping = (e) => {
    const message = e.target.value;
    setNewMessage(message);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Only emit typing if message is not empty
    if (socket && message.trim()) {
      // Emit typing event
      socket.emit("typing", {
        chatId: selectedChat._id,
        userId: user._id,
        user: {
          _id: user._id,
          name: user.name,
          pic: user.pic,
        },
      });

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop typing", {
          chatId: selectedChat._id,
          userId: user._id,
        });
      }, 1000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      // Stop typing when sending message
      if (socket) {
        socket.emit("stop typing", {
          chatId: selectedChat._id,
          userId: user._id,
        });
      }

      const response = await fetch("http://localhost:5001/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Call parent component's send message handler
      onSendMessage(data);

      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="bg-white p-4 border-t flex items-center space-x-2"
    >
      {/* Emoji Button */}
      <button type="button" className="text-gray-600 hover:text-gray-900">
        <FaceSmileIcon className="h-6 w-6" />
      </button>

      {/* Attachment Button */}
      <button type="button" className="text-gray-600 hover:text-gray-900">
        <PaperClipIcon className="h-6 w-6" />
      </button>

      {/* Message Input */}
      <input
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={handleTyping}
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={!newMessage.trim()}
        className={`
          text-white p-2 rounded-full 
          ${
            newMessage.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
      >
        <PaperAirplaneIcon className="h-6 w-6" />
      </button>
    </form>
  );
};

export default MessageInput;
