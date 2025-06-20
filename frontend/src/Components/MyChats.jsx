import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import { PlusIcon } from "@heroicons/react/24/outline";
import GroupChatModal from "./GroupChatModal";
import getBaseUrl from "../Url";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDeleteSweep } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const optionsRef = useRef();
  const fetchChats = async () => {
    try {
      const response = await fetch(`${getBaseUrl()}/chat`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSenderName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const getSenderPic = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };

  const handleClearChat = async (chatId) => {
    try {
      const response = await fetch(`${getBaseUrl()}/chat/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to clear chat");
      }

      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`${getBaseUrl()}/chat/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to Delete chat");
      }
      const updatedChats = chats.filter((chat) => chat._id !== chatId);
      setChats(updatedChats);

      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error Deleting chat:", error);
    }
  };

  return (
    <div
      className={`md:w-[30%] bg-[#EBE8DB] border-r border-[#D76C82] flex flex-col h-full ${
        selectedChat ? "hidden md:flex" : "flex"
      }`}
    >
      {/* My Chats Heading with Plus Button */}
      <div className="p-4 bg-gradient-to-r from-[#EBE8DB] to-[#D76C82] flex justify-between items-center shadow-md">
        <h2
          className="text-2xl font-bold text-[#3D0301]"
          style={{ fontFamily: "'Underdog', cursive" }}
        >
          My Chats
        </h2>
        <button
          onClick={() => setIsGroupChatModalOpen(true)}
          className="bg-[#8A0032] text-[#EBE8DB] p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 hover:shadow-lg hover:cursor-pointer"
          title="Create Group Chat"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto flex-1">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`relative group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm
                  ${
                    selectedChat?._id === chat._id
                      ? "bg-[#8A0032] text-[#EBE8DB]"
                      : "bg-[#D76C82] bg-opacity-20 hover:bg-opacity-40"
                  }`}
            >
              {!chat.isGroupChat ? (
                <img
                  src={getSenderPic(user, chat.users)}
                  alt="User"
                  className={`h-12 w-12 rounded-full mr-3 object-cover border-2 ${
                    selectedChat?._id === chat._id
                      ? "border-[#EBE8DB]"
                      : "border-[#8A0032]"
                  }`}
                />
              ) : (
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center mr-3 ${
                    selectedChat?._id === chat._id
                      ? "bg-[#EBE8DB] text-[#8A0032]"
                      : "bg-[#8A0032] text-[#EBE8DB]"
                  }`}
                >
                  <span
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Underdog', cursive" }}
                  >
                    {chat.chatName[0].toUpperCase()}
                  </span>
                </div>
              )}

              <div className="overflow-hidden">
                <h3
                  className={`font-semibold ${
                    selectedChat?._id === chat._id ? "" : "text-[#3D0301]"
                  }`}
                  style={{ fontFamily: "'Underdog', cursive" }}
                >
                  {!chat.isGroupChat
                    ? getSenderName(user, chat.users)
                    : chat.chatName}
                </h3>
                {chat.latestMessage && (
                  <p
                    className={`text-sm truncate max-w-[200px] ${
                      selectedChat?._id === chat._id
                        ? "text-[#EBE8DB] text-opacity-80"
                        : "text-[#8A0032]"
                    }`}
                  >
                    {chat.latestMessage.content}
                  </p>
                )}
              </div>
              <div className="relative ml-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(showOptions === chat._id ? null : chat._id);
                  }}
                  className="hidden group-hover:flex items-center justify-center p-2 text-[#EBE8DB] hover:text-[#EBE8DB] hover:bg-[#8A0032] rounded-full transition-all cursor-pointer"
                >
                  <HiOutlineDotsHorizontal className="h-5 w-5" />
                </button>

                {/* Dropdown */}
                {showOptions === chat._id && (
                  <div
                    ref={optionsRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-lg w-40 z-50"
                  >
                    <button
                      onClick={() => {
                        handleClearChat(chat._id);
                        setShowOptions(null);
                      }}
                      className="w-full flex items-center gap-5 px-4 py-2 text-sm text-[#8A0032] hover:bg-[#FDE9EC] transition-colors rounded-md cursor-pointer"
                    >
                      <span className="truncate">Clear Chat</span>
                      <TiDeleteOutline className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => {
                        handleDeleteChat(chat._id);
                        setShowOptions(null);
                      }}
                      className="w-full flex items-center gap-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-md cursor-pointer"
                    >
                      <span className="truncate">Delete Chat</span>
                      <MdDeleteSweep className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <p
              className="text-xl font-medium text-[#8A0032] mb-2"
              style={{ fontFamily: "'Underdog', cursive" }}
            >
              No Chats Yet
            </p>
            <p className="text-[#3D0301] mb-4">
              Start a conversation or create a group
            </p>
            <button
              onClick={() => setIsGroupChatModalOpen(true)}
              className="bg-[#8A0032] text-[#EBE8DB] px-4 py-2 rounded-full hover:bg-opacity-90 transition-all flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Group Chat
            </button>
          </div>
        )}
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
