import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

const ChatHeader = ({ selectedChat, user, onDetailsClick }) => {
  // Get user for one-to-one chat
  const getOtherUser = () => {
    return selectedChat.users.find((u) => u._id !== user._id);
  };

  return (
    <div className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="flex items-center">
        {!selectedChat.isGroupChat ? (
          <img
            src={getOtherUser().pic}
            alt="User"
            className="h-10 w-10 rounded-full mr-3"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center mr-3">
            <span className="text-white font-bold">
              {selectedChat.chatName[0]}
            </span>
          </div>
        )}

        <h2 className="text-xl font-semibold">
          {!selectedChat.isGroupChat
            ? getOtherUser().name
            : selectedChat.chatName}
        </h2>
      </div>

      {/* Eye Icon for Details (Only for Group Chats) */}
      {selectedChat.isGroupChat && (
        <button
          onClick={onDetailsClick}
          className="text-gray-600 hover:text-gray-900"
        >
          <EyeIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
