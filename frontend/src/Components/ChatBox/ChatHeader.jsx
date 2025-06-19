import React from "react";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const ChatHeader = ({ selectedChat, user, onDetailsClick, onBackClick }) => {
  // Get user for one-to-one chat
  const getOtherUser = () => {
    return selectedChat.users.find((u) => u._id !== user._id);
  };

  return (
    <div className="bg-gradient-to-r from-[#EBE8DB] to-[#D76C82] p-3 md:p-4 flex justify-between items-center shadow-md border-b border-[#D76C82]">
      <div className="flex items-center">
        {/* Back button - only visible on mobile */}
        <button
          onClick={onBackClick}
          className="md:hidden mr-2 text-[#3D0301] hover:text-[#8A0032] transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        {!selectedChat.isGroupChat ? (
          <img
            src={getOtherUser().pic}
            alt={getOtherUser().name}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full mr-3 border-2 border-[#8A0032] object-cover shadow-sm"
          />
        ) : (
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#8A0032] flex items-center justify-center mr-3 shadow-sm border-2 border-[#8A0032]">
            <span
              className="text-[#EBE8DB] font-bold text-lg md:text-xl"
              style={{ fontFamily: "'Underdog', cursive" }}
            >
              {selectedChat.chatName[0].toUpperCase()}
            </span>
          </div>
        )}

        <div>
          <h2
            className="text-lg md:text-xl font-semibold text-[#3D0301] truncate max-w-[150px] sm:max-w-xs md:max-w-sm"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            {!selectedChat.isGroupChat
              ? getOtherUser().name
              : selectedChat.chatName}
          </h2>

          {selectedChat.isGroupChat && (
            <p className="text-xs text-[#8A0032]">
              {selectedChat.users.length} members
            </p>
          )}
        </div>
      </div>

      {selectedChat.isGroupChat && (
        <button
          onClick={onDetailsClick}
          className="text-[#3D0301] hover:text-[#8A0032] transition-colors p-2 rounded-full hover:bg-[#894553] hover:bg-opacity-50 cursor-pointer"
          aria-label="View group details"
          title="View group details"
        >
          <EllipsisVerticalIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
