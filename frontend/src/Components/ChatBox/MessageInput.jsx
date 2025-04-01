import React, { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ selectedChat, user, onSendMessage, socket }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

      const response = await fetch(
        "https://chat-application-1795.onrender.com/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        }
      );

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

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    // Focus on input when emoji picker is toggled
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    // Add emoji to current message
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);

    // Optionally, keep the emoji picker open
    // setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSendMessage}
        className="bg-white p-4 border-t flex items-center space-x-2"
      >
        {/* Emoji Button */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaceSmileIcon className="h-6 w-6" />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full left-0 mb-2 z-50"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                height={400}
                width={300}
                searchDisabled
                skinTonePickerLocation="PREVIEW"
              />
            </div>
          )}
        </div>

        {/* Message Input */}
        <input
          ref={inputRef}
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
    </div>
  );
};

export default MessageInput;
