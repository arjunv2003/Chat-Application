import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const GroupChatDetailsModal = ({ chat, user, onClose, onUpdateChat }) => {
  const [groupName, setGroupName] = useState(chat.chatName);
  const [selectedUsersToRemove, setSelectedUsersToRemove] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);

  // Search Users to Add
  const handleSearchUsers = async () => {
    if (!searchUsers.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/user?search=${searchUsers}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search users");
      }

      const data = await response.json();

      // Filter out users already in the group
      const filteredUsers = data.filter(
        (searchUser) =>
          !chat.users.some((groupUser) => groupUser._id === searchUser._id)
      );

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      alert(error.message || "Failed to search users");
    }
  };

  // Remove Users from Group
  const handleRemoveUsers = async () => {
    if (selectedUsersToRemove.length === 0) {
      alert("Please select users to remove");
      return;
    }

    try {
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/chat/groupremove`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            chatId: chat._id,
            userId: selectedUsersToRemove[0],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove users");
      }

      const updatedChat = await response.json();
      onUpdateChat(updatedChat);
      setSelectedUsersToRemove([]);
    } catch (error) {
      console.error("Error removing users:", error);
      alert(error.message || "Failed to remove users");
    }
  };

  // Add Users to Group
  const handleAddUsers = async () => {
    if (selectedUsersToAdd.length === 0) {
      alert("Please select users to add");
      return;
    }

    try {
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/chat/groupadd`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            chatId: chat._id,
            userId: selectedUsersToAdd,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add users");
      }

      const updatedChat = await response.json();
      onUpdateChat(updatedChat);
      setSearchUsers("");
      setSearchResults([]);
      setSelectedUsersToAdd([]);
    } catch (error) {
      console.error("Error adding users:", error);
      alert(error.message || "Failed to add users");
    }
  };

  // Leave Group
  const handleLeaveGroup = async () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this group?"
    );
    if (!confirmLeave) return;

    try {
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/chat/groupremove`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            chatId: chat._id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to leave group");
      }

      onUpdateChat(null);
      onClose();
    } catch (error) {
      console.error("Error leaving group:", error);
      alert(error.message || "Failed to leave group");
    }
  };

  // Rename Group
  const handleUpdateGroupName = async () => {
    if (!groupName.trim()) {
      alert("Group name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/chat/rename`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            chatId: chat._id,
            chatName: groupName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update group name");
      }

      const updatedChat = await response.json();
      onUpdateChat(updatedChat);
      onClose();
    } catch (error) {
      console.error("Error updating group name:", error);
      alert(error.message || "Failed to update group name");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Group Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Group Name Edit */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <div className="flex">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 p-2 border rounded-l-md"
              disabled={chat.groupAdmin._id !== user._id}
            />
            {chat.groupAdmin._id === user._id && (
              <button
                onClick={handleUpdateGroupName}
                className="bg-blue-500 text-white px-4 rounded-r-md"
              >
                Update
              </button>
            )}
          </div>
        </div>

        {/* Add Users (for admin) */}
        {chat.groupAdmin._id === user._id && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Users to Group
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Search users"
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                className="flex-1 p-2 border rounded-l-md"
              />
              <button
                onClick={handleSearchUsers}
                className="bg-blue-500 text-white px-4 rounded-r-md"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto">
                {searchResults.map((searchUser) => (
                  <div
                    key={searchUser._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <img
                        src={searchUser.pic}
                        alt={searchUser.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span>{searchUser.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsersToAdd.includes(searchUser._id)}
                      onChange={() => {
                        setSelectedUsersToAdd((prev) =>
                          prev.includes(searchUser._id)
                            ? prev.filter((id) => id !== searchUser._id)
                            : [...prev, searchUser._id]
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Add Users Button */}
            {selectedUsersToAdd.length > 0 && (
              <button
                onClick={handleAddUsers}
                className="w-full mt-2 bg-green-500 text-white p-2 rounded flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add {selectedUsersToAdd.length} User
                {selectedUsersToAdd.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Group Members */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Group Members</h3>
          {chat.users.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-2 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <img
                  src={member.pic}
                  alt={member.name}
                  className="h-8 w-8 rounded-full mr-2"
                />
                <div>
                  <span>{member.name}</span>
                  {member._id === chat.groupAdmin._id && (
                    <span className="ml-2 text-xs text-gray-500">(Admin)</span>
                  )}
                </div>
              </div>
              {chat.groupAdmin._id === user._id && member._id !== user._id && (
                <input
                  type="checkbox"
                  checked={selectedUsersToRemove.includes(member._id)}
                  onChange={() => {
                    setSelectedUsersToRemove((prev) =>
                      prev.includes(member._id)
                        ? prev.filter((id) => id !== member._id)
                        : [...prev, member._id]
                    );
                  }}
                />
              )}
            </div>
          ))}

          {/* Remove Member Button (for admin) */}
          {chat.groupAdmin._id === user._id &&
            selectedUsersToRemove.length > 0 && (
              <button
                onClick={handleRemoveUsers}
                className="w-full mt-4 bg-red-500 text-white p-2 rounded flex items-center justify-center"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Remove {selectedUsersToRemove.length} Member
                {selectedUsersToRemove.length > 1 ? "s" : ""}
              </button>
            )}

          {/* Leave Group Button */}
          <button
            onClick={handleLeaveGroup}
            className="w-full mt-4 bg-yellow-500 text-white p-2 rounded flex items-center justify-center"
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatDetailsModal;
