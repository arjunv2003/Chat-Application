import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { XMarkIcon } from "@heroicons/react/24/outline";

const GroupChatModal = ({ onClose }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats, setSelectedChat } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/user?search=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        }),
      });

      const data = await response.json();

      // Add new group chat to existing chats
      setChats([data, ...chats]);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      console.error("Group chat creation error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Close modal only if clicking on the overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Group Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* User Search Input */}
        <input
          type="text"
          placeholder="Add users"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center"
            >
              {user.name}
              <button onClick={() => handleRemoveUser(user)} className="ml-2">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => handleAddUser(user)}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={user.pic}
                  alt={user.name}
                  className="h-8 w-8 rounded-full mr-3"
                />
                <div>
                  <p>{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;
