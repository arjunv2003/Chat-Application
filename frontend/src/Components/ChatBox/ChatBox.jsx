import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import GroupChatDetailsModal from "./GroupChatDetailsModal";
import io from "socket.io-client";

const ENDPOINT = "https://chat-application-1795.onrender.com";

const ChatBox = () => {
  const { selectedChat, setSelectedChat, user, setChats, addNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Typing state
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  // Use refs to store socket and selected chat
  const socketRef = useRef(null);
  const selectedChatRef = useRef(null);

  // Fetch Messages
  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/message/${selectedChat._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
      setLoading(false);

      // Join chat room
      if (socketRef.current) {
        socketRef.current.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  }, [selectedChat, user]);

  // Setup socket connection
  useEffect(() => {
    // Create socket connection
    socketRef.current = io(ENDPOINT, {
      transports: ["websocket"],
      forceNew: true,
    });

    // Setup user connection
    socketRef.current.emit("setup", user);

    // Typing event listeners
    socketRef.current.on("typing", (typingInfo) => {
      if (selectedChat && typingInfo.chatId === selectedChat._id) {
        setIsTyping(true);
        setTypingUser(typingInfo.user);
      }
    });

    socketRef.current.on("stop typing", (typingInfo) => {
      if (selectedChat && typingInfo.chatId === selectedChat._id) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    // New message listener
    socketRef.current.on("message received", (newMessage) => {
      if (
        !selectedChatRef.current ||
        selectedChatRef.current._id !== newMessage.chat._id
      ) {
        // Add notification for new message in another chat
        addNotification(newMessage);
      } else {
        // Add new message to current chat
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Cleanup socket on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, addNotification, selectedChat]);

  // Fetch messages when chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatRef.current = selectedChat;
  }, [selectedChat, fetchMessages]);

  // Handle new message
  const handleNewMessage = (newMessage) => {
    // Add message to local state
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Emit new message via socket
    if (socketRef.current) {
      socketRef.current.emit("new message", newMessage);
    }
  };

  const handleUpdateChat = (updatedChat) => {
    if (updatedChat) {
      setSelectedChat(updatedChat);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        )
      );
    } else {
      // If updatedChat is null (left group), clear selected chat
      setSelectedChat(null);
      setChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== selectedChat._id)
      );
    }
  };

  return (
    <div className={`md:w-[70%] ${selectedChat ? "block" : "hidden md:block"}`}>
      {selectedChat ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <ChatHeader
            selectedChat={selectedChat}
            user={user}
            onDetailsClick={() => setIsDetailsModalOpen(true)}
          />

          {/* Chat Messages */}
          <ChatMessages
            messages={messages}
            user={user}
            loading={loading}
            isTyping={isTyping}
            typingUser={typingUser}
          />

          {/* Message Input */}
          <MessageInput
            selectedChat={selectedChat}
            user={user}
            onSendMessage={handleNewMessage}
            socket={socketRef.current}
          />

          {/* Details Modal */}
          {isDetailsModalOpen && selectedChat.isGroupChat && (
            <GroupChatDetailsModal
              chat={selectedChat}
              user={user}
              onClose={() => setIsDetailsModalOpen(false)}
              onUpdateChat={handleUpdateChat}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500 text-xl">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
