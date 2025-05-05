import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import getBaseUrl from "../../Url";
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
        `${getBaseUrl()}/user?search=${searchUsers}`,
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
      const response = await fetch(`${getBaseUrl()}/chat/groupremove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: chat._id,
          userId: selectedUsersToRemove[0],
        }),
      });

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
      const response = await fetch(`${getBaseUrl()}/chat/groupadd`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: chat._id,
          userId: selectedUsersToAdd,
        }),
      });

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
      const response = await fetch(`${getBaseUrl()}/chat/groupremove`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: chat._id,
        }),
      });

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
      const response = await fetch(`${getBaseUrl()}/chat/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          chatId: chat._id,
          chatName: groupName,
        }),
      });

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
      className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-[#EBE8DB] rounded-lg p-5 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#D76C82]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-[#D76C82]">
          <h2
            className="text-2xl font-bold text-[#8A0032]"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            Group Details
          </h2>
          <button
            onClick={onClose}
            className="text-[#3D0301] hover:text-[#8A0032] transition-colors p-1 rounded-full hover:bg-[#D76C82] hover:bg-opacity-20 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Group Name Edit */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#3D0301] mb-2">
            Group Name
          </label>
          <div className="flex">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1 p-2 border-2 border-[#D76C82] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#8A0032] bg-white text-[#3D0301]"
              disabled={chat.groupAdmin._id !== user._id}
            />
            {chat.groupAdmin._id === user._id && (
              <button
                onClick={handleUpdateGroupName}
                className="bg-[#8A0032] text-[#EBE8DB] px-4 rounded-r-md hover:bg-opacity-90 cursor-pointer transition-colors "
              >
                Update
              </button>
            )}
          </div>
        </div>

        {/* Add Users (for admin) */}
        {chat.groupAdmin._id === user._id && (
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-[#3D0301] mb-2"
              style={{ fontFamily: "'Underdog', cursive" }}
            >
              Add Users to Group
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Search users"
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                className="flex-1 p-2 border-2 border-[#D76C82] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#8A0032] bg-white text-[#3D0301] placeholder-[#B03052] placeholder-opacity-60"
              />
              <button
                onClick={handleSearchUsers}
                className="bg-[#8A0032] text-[#EBE8DB] px-4 rounded-r-md hover:bg-opacity-90 cursor-pointer transition-colors"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 max-h-40 overflow-y-auto border-2 border-[#D76C82] rounded-md bg-white">
                {searchResults.map((searchUser) => (
                  <div
                    key={searchUser._id}
                    className="flex items-center justify-between p-2 hover:bg-[#D76C82] hover:bg-opacity-10 border-b border-[#D76C82] border-opacity-30 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={searchUser.pic}
                        alt={searchUser.name}
                        className="h-8 w-8 rounded-full mr-2 border border-[#8A0032] object-cover"
                      />
                      <span className="text-[#3D0301]">{searchUser.name}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`add-${searchUser._id}`}
                        checked={selectedUsersToAdd.includes(searchUser._id)}
                        onChange={() => {
                          setSelectedUsersToAdd((prev) =>
                            prev.includes(searchUser._id)
                              ? prev.filter((id) => id !== searchUser._id)
                              : [...prev, searchUser._id]
                          );
                        }}
                        className="w-4 h-4 accent-[#8A0032]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Users Button */}
            {selectedUsersToAdd.length > 0 && (
              <button
                onClick={handleAddUsers}
                className="w-full mt-3 bg-[#8A0032] text-[#EBE8DB] p-2 rounded-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer transition-colors"
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
          <h3
            className="text-lg font-semibold mb-3 text-[#8A0032]"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            Group Members
          </h3>
          <div className="border-2 border-[#D76C82] rounded-md bg-white mb-4 max-h-60 overflow-y-auto">
            {chat.users.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-2 hover:bg-[#D76C82] hover:bg-opacity-10 border-b border-[#D76C82] border-opacity-30 last:border-b-0"
              >
                <div className="flex items-center">
                  <img
                    src={member.pic}
                    alt={member.name}
                    className="h-10 w-10 rounded-full mr-3 border-2 border-[#8A0032] object-cover"
                  />
                  <div>
                    <span className="text-[#3D0301] font-medium">
                      {member.name}
                    </span>
                    {member._id === chat.groupAdmin._id && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-[#8A0032] text-[#EBE8DB] rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                {chat.groupAdmin._id === user._id &&
                  member._id !== user._id && (
                    <input
                      type="checkbox"
                      id={`remove-${member._id}`}
                      checked={selectedUsersToRemove.includes(member._id)}
                      onChange={() => {
                        setSelectedUsersToRemove((prev) =>
                          prev.includes(member._id)
                            ? prev.filter((id) => id !== member._id)
                            : [...prev, member._id]
                        );
                      }}
                      className="w-4 h-4 accent-[#8A0032]"
                    />
                  )}
              </div>
            ))}
          </div>

          {/* Remove Member Button (for admin) */}
          {chat.groupAdmin._id === user._id &&
            selectedUsersToRemove.length > 0 && (
              <button
                onClick={handleRemoveUsers}
                className="w-full mb-4 bg-[#8A0032] text-[#EBE8DB] p-2.5 rounded-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer transition-colors"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Remove {selectedUsersToRemove.length} Member
                {selectedUsersToRemove.length > 1 ? "s" : ""}
              </button>
            )}

          {/* Leave Group Button */}
          <button
            onClick={handleLeaveGroup}
            className="w-full mt-4 bg-[#8A0032] text-[#EBE8DB] p-2.5 rounded-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer transition-colors"
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatDetailsModal;
