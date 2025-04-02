import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { PlusIcon } from "@heroicons/react/24/outline";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        "https://chat-application-1795.onrender.com/api/chat",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const getSenderName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getSenderPic = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };

  return (
    <div
      className={`md:w-[30%] bg-white border-r flex flex-col h-full ${
        selectedChat ? "hidden md:flex" : "flex"
      }`}
    >
      {/* My Chats Heading with Plus Button */}
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Chats</h2>
        <button
          onClick={() => setIsGroupChatModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="p-3 space-y-2 overflow-y-auto flex-1">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChat(chat)}
            className={`
              flex items-center p-3 rounded-lg cursor-pointer 
              ${
                selectedChat?._id === chat._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }
            `}
          >
            {!chat.isGroupChat ? (
              <img
                src={getSenderPic(user, chat.users)}
                alt="User"
                className="h-10 w-10 rounded-full mr-3"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                <span className="text-white font-bold">{chat.chatName[0]}</span>
              </div>
            )}

            <div>
              <h3 className="font-semibold">
                {!chat.isGroupChat
                  ? getSenderName(user, chat.users)
                  : chat.chatName}
              </h3>
              {chat.latestMessage && (
                <p className="text-sm truncate">{chat.latestMessage.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Group Chat Modal */}
      {isGroupChatModalOpen && (
        <GroupChatModal
          onClose={() => setIsGroupChatModalOpen(false)}
          fetchChats={fetchChats}
        />
      )}
    </div>
  );
};

export default MyChats;
