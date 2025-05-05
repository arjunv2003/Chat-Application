import React, { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import getBaseUrl from "../../Url";
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

    // Capture the current message
    const messageToSend = newMessage;

    // Immediately clear the input box
    setNewMessage("");

    try {
      // Stop typing when sending message
      if (socket) {
        socket.emit("stop typing", {
          chatId: selectedChat._id,
          userId: user._id,
        });
      }

      const response = await fetch(`${getBaseUrl()}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          content: messageToSend,
          chatId: selectedChat._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Call parent component's send message handler only with server response
      onSendMessage(data);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, handle error (e.g., show error message, restore input)
      setNewMessage(messageToSend);
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
        className="bg-[#EBE8DB] p-2 sm:p-3 md:p-4 border-t border-[#D76C82] flex items-center space-x-1 sm:space-x-2 shadow-inner"
      >
        {/* Emoji Button */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className="text-[#8A0032] hover:text-[#3D0301] transition-colors p-1.5 sm:p-2 rounded-full hover:bg-[#D76C82] hover:bg-opacity-20 flex-shrink-0"
            aria-label="Open emoji picker"
          >
            <FaceSmileIcon className="h-5 w-5" />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full left-5 mb-2 z-50"
              style={{
                maxWidth: "calc(100vw - 20px)",
                transform: "translateX(-10%)",
              }}
            >
              <div className="shadow-xl rounded-lg overflow-hidden">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={300}
                  width={280}
                  searchDisabled
                  skinTonePickerLocation="PREVIEW"
                  previewConfig={{ showPreview: false }}
                  theme="light"
                />
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          className="flex-1 min-w-0 p-2 text-sm sm:text-base border-2 border-[#D76C82] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A0032] bg-white text-[#3D0301] placeholder-[#B03052] placeholder-opacity-60"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`
            text-white p-1.5 sm:p-2 rounded-full transition-all duration-200 flex-shrink-0
            ${
              newMessage.trim()
                ? "bg-[#8A0032] hover:bg-opacity-90 hover:shadow-md"
                : "bg-[#D76C82] bg-opacity-50 cursor-not-allowed"
            }
          `}
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
