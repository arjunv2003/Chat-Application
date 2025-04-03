// import React, { useState } from "react";
// import { ChatState } from "../Context/ChatProvider";
// import { XMarkIcon } from "@heroicons/react/24/outline";

// const GroupChatModal = ({ onClose }) => {
//   const [groupChatName, setGroupChatName] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const { user, chats, setChats, setSelectedChat } = ChatState();

//   const handleSearch = async (query) => {
//     setSearch(query);
//     if (!query) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(
//         `https://chat-application-1795.onrender.com/api/user?search=${query}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       const data = await response.json();
//       setSearchResults(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Search error:", error);
//       setLoading(false);
//     }
//   };

//   const handleAddUser = (userToAdd) => {
//     if (selectedUsers.some((u) => u._id === userToAdd._id)) {
//       return;
//     }
//     setSelectedUsers([...selectedUsers, userToAdd]);
//     setSearch("");
//     setSearchResults([]);
//   };

//   const handleRemoveUser = (userToRemove) => {
//     setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
//   };

//   const handleSubmit = async () => {
//     if (!groupChatName || selectedUsers.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://chat-application-1795.onrender.com/api/chat/group",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({
//             name: groupChatName,
//             users: JSON.stringify(selectedUsers.map((u) => u._id)),
//           }),
//         }
//       );

//       const data = await response.json();

//       // Add new group chat to existing chats
//       setChats([data, ...chats]);
//       setSelectedChat(data);
//       onClose();
//     } catch (error) {
//       console.error("Group chat creation error:", error);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
//       onClick={(e) => {
//         // Close modal only if clicking on the overlay
//         if (e.target === e.currentTarget) {
//           onClose();
//         }
//       }}
//     >
//       <div
//         className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//       >
//         <div className="flex justify-between items-center mb-4">
//           {/* <h2 className="text-2xl font-bold">Create Group Chat</h2> */}
//           <h4 className="text-3xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-[Poppins] drop-shadow-md">
//             Create Group Chat
//           </h4>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Group Name Input */}
//         <input
//           type="text"
//           placeholder="Group Name"
//           value={groupChatName}
//           onChange={(e) => setGroupChatName(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />

//         {/* User Search Input */}
//         <input
//           type="text"
//           placeholder="Add users"
//           value={search}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />

//         {/* Selected Users */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {selectedUsers.map((user) => (
//             <div
//               key={user._id}
//               className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center"
//             >
//               {user.name}
//               <button onClick={() => handleRemoveUser(user)} className="ml-2">
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Search Results */}
//         {loading ? (
//           <div className="flex justify-center items-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="max-h-40 overflow-y-auto">
//             {searchResults.map((user) => (
//               <div
//                 key={user._id}
//                 onClick={() => handleAddUser(user)}
//                 className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
//               >
//                 <img
//                   src={user.pic}
//                   alt={user.name}
//                   className="h-8 w-8 rounded-full mr-3"
//                 />
//                 <div>
//                   <p>{user.name}</p>
//                   <p className="text-sm text-gray-500">{user.email}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Create Button */}
//         <button
//           onClick={handleSubmit}
//           className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
//         >
//           Create Group
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GroupChatModal;

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
        `https://chat-application-1795.onrender.com/api/user?search=${query}`,
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
      const response = await fetch(
        "https://chat-application-1795.onrender.com/api/chat/group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          }),
        }
      );

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
      className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal only if clicking on the overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-[#EBE8DB] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="bg-gradient-to-r from-[#EBE8DB] to-[#D76C82] p-4 rounded-t-lg flex justify-between items-center">
          <h2
            className="text-xl sm:text-2xl font-bold text-[#3D0301]"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            Create Group Chat
          </h2>
          <button
            onClick={onClose}
            className="text-[#3D0301] hover:text-[#8A0032] transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Group Name Input */}
          <div className="mb-4">
            <label
              htmlFor="groupName"
              className="block text-[#3D0301] font-medium mb-1"
              style={{ fontFamily: "'Underdog', cursive" }}
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              placeholder="Enter a name for your group"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="w-full p-2 border border-[#D76C82] rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#8A0032]"
            />
          </div>

          {/* User Search Input */}
          <div className="mb-4">
            <label
              htmlFor="userSearch"
              className="block text-[#3D0301] font-medium mb-1"
              style={{ fontFamily: "'Underdog', cursive" }}
            >
              Add Members
            </label>
            <input
              id="userSearch"
              type="text"
              placeholder="Search users by name or email"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 border border-[#D76C82] rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#8A0032]"
            />
          </div>

          {/* Selected Users */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="bg-[#8A0032] text-[#EBE8DB] px-3 py-1 rounded-full flex items-center text-sm"
              >
                <span className="mr-1">{user.name}</span>
                <button
                  onClick={() => handleRemoveUser(user)}
                  className="ml-1 hover:text-white focus:outline-none"
                  aria-label={`Remove ${user.name}`}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Search Results */}
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8A0032]"></div>
            </div>
          ) : (
            searchResults.length > 0 && (
              <div className="border border-[#D76C82] rounded bg-white mb-4">
                <div className="max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleAddUser(user)}
                      className="flex items-center p-2 hover:bg-[#EBE8DB] cursor-pointer border-b border-[#D76C82] last:border-b-0"
                    >
                      <img
                        src={user.pic}
                        alt={user.name}
                        className="h-10 w-10 rounded-full mr-3 object-cover border border-[#D76C82]"
                      />
                      <div>
                        <p className="text-[#3D0301] font-medium">
                          {user.name}
                        </p>
                        <p className="text-sm text-[#8A0032]">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Create Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#8A0032] text-[#EBE8DB] p-3 rounded-lg mt-2 hover:bg-opacity-90 transition-all duration-200 font-medium shadow-md"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
