// import React, { useState } from "react";
// import { ChatState } from "../Context/ChatProvider";
// import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

// const GroupChatDetailsModal = ({ chat, user, onClose, onUpdateChat }) => {
//   const [groupName, setGroupName] = useState(chat.chatName);
//   const [selectedUsersToRemove, setSelectedUsersToRemove] = useState([]);
//   const [searchUsers, setSearchUsers] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);

//   // Search Users to Add
//   const handleSearchUsers = async () => {
//     if (!searchUsers.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/user?search=${searchUsers}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to search users");
//       }

//       const data = await response.json();

//       // Filter out users already in the group
//       const filteredUsers = data.filter(
//         (searchUser) =>
//           !chat.users.some((groupUser) => groupUser._id === searchUser._id)
//       );

//       setSearchResults(filteredUsers);
//     } catch (error) {
//       console.error("Error searching users:", error);
//       alert(error.message || "Failed to search users");
//     }
//   };

//   // Remove User from Group
//   const handleRemoveUsers = async () => {
//     if (selectedUsersToRemove.length === 0) {
//       alert("Please select a user to remove");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/chat/groupremove`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({
//             chatId: chat._id,
//             userId: selectedUsersToRemove[0], // Remove single user
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to remove user");
//       }

//       const updatedChat = await response.json();
//       onUpdateChat(updatedChat);
//       onClose();
//     } catch (error) {
//       console.error("Error removing users:", error);
//       alert(error.message || "Failed to remove users");
//     }
//   };

//   // Add Users to Group
//   const handleAddUsers = async () => {
//     if (selectedUsersToAdd.length === 0) {
//       alert("Please select users to add");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5001/api/chat/groupadd`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({
//           chatId: chat._id,
//           userId: selectedUsersToAdd,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add users");
//       }

//       const updatedChat = await response.json();
//       onUpdateChat(updatedChat);
//       setSearchUsers("");
//       setSearchResults([]);
//       setSelectedUsersToAdd([]);
//     } catch (error) {
//       console.error("Error adding users:", error);
//       alert(error.message || "Failed to add users");
//     }
//   };

//   // Leave Group
//   const handleLeaveGroup = async () => {
//     const confirmLeave = window.confirm(
//       "Are you sure you want to leave this group?"
//     );
//     if (!confirmLeave) return;

//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/chat/groupremove`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({
//             chatId: chat._id,
//             userId: user._id,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to leave group");
//       }

//       onUpdateChat(null); // Clear selected chat
//       onClose();
//     } catch (error) {
//       console.error("Error leaving group:", error);
//       alert(error.message || "Failed to leave group");
//     }
//   };

//   // Rename Group
//   const handleUpdateGroupName = async () => {
//     if (!groupName.trim()) {
//       alert("Group name cannot be empty");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5001/api/chat/rename`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({
//           chatId: chat._id,
//           chatName: groupName,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update group name");
//       }

//       const updatedChat = await response.json();
//       onUpdateChat(updatedChat);
//       onClose();
//     } catch (error) {
//       console.error("Error updating group name:", error);
//       alert(error.message || "Failed to update group name");
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           onClose();
//         }
//       }}
//     >
//       <div
//         className="bg-white rounded-lg p-6 w-96 max-w-md max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Group Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Group Name Edit */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Group Name
//           </label>
//           <div className="flex">
//             <input
//               type="text"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="flex-1 p-2 border rounded-l-md"
//               disabled={chat.groupAdmin._id !== user._id}
//             />
//             {chat.groupAdmin._id === user._id && (
//               <button
//                 onClick={handleUpdateGroupName}
//                 className="bg-blue-500 text-white px-4 rounded-r-md"
//               >
//                 Update
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Add Users (for admin) */}
//         {chat.groupAdmin._id === user._id && (
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Add Users to Group
//             </label>
//             <div className="flex">
//               <input
//                 type="text"
//                 placeholder="Search users"
//                 value={searchUsers}
//                 onChange={(e) => setSearchUsers(e.target.value)}
//                 className="flex-1 p-2 border rounded-l-md"
//               />
//               <button
//                 onClick={handleSearchUsers}
//                 className="bg-blue-500 text-white px-4 rounded-r-md"
//               >
//                 Search
//               </button>
//             </div>

//             {/* Search Results */}
//             {searchResults.length > 0 && (
//               <div className="mt-2 max-h-40 overflow-y-auto">
//                 {searchResults.map((searchUser) => (
//                   <div
//                     key={searchUser._id}
//                     className="flex items-center justify-between p-2 hover:bg-gray-100"
//                   >
//                     <div className="flex items-center">
//                       <img
//                         src={searchUser.pic}
//                         alt={searchUser.name}
//                         className="h-8 w-8 rounded-full mr-2"
//                       />
//                       <span>{searchUser.name}</span>
//                     </div>
//                     <input
//                       type="checkbox"
//                       checked={selectedUsersToAdd.includes(searchUser._id)}
//                       onChange={() => {
//                         setSelectedUsersToAdd((prev) =>
//                           prev.includes(searchUser._id)
//                             ? prev.filter((id) => id !== searchUser._id)
//                             : [...prev, searchUser._id]
//                         );
//                       }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Add Users Button */}
//             {selectedUsersToAdd.length > 0 && (
//               <button
//                 onClick={handleAddUsers}
//                 className="w-full mt-2 bg-green-500 text-white p-2 rounded"
//               >
//                 Add {selectedUsersToAdd.length} User
//                 {selectedUsersToAdd.length > 1 ? "s" : ""}
//               </button>
//             )}
//           </div>
//         )}

//         {/* Group Members */}
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Group Members</h3>
//           {chat.users.map((member) => (
//             <div
//               key={member._id}
//               className="flex items-center justify-between p-2 hover:bg-gray-100"
//             >
//               <div className="flex items-center">
//                 <img
//                   src={member.pic}
//                   alt={member.name}
//                   className="h-8 w-8 rounded-full mr-2"
//                 />
//                 <span>{member.name}</span>
//                 {member._id === chat.groupAdmin._id && (
//                   <span className="ml-2 text-xs text-gray-500">(Admin)</span>
//                 )}
//               </div>
//               {chat.groupAdmin._id === user._id && member._id !== user._id && (
//                 <input
//                   type="checkbox"
//                   checked={selectedUsersToRemove.includes(member._id)}
//                   onChange={() => {
//                     setSelectedUsersToRemove((prev) =>
//                       prev.includes(member._id)
//                         ? prev.filter((id) => id !== member._id)
//                         : [...prev, member._id]
//                     );
//                   }}
//                 />
//               )}
//             </div>
//           ))}

//           {/* Remove Member Button (for admin) */}
//           {chat.groupAdmin._id === user._id && (
//             <button
//               onClick={handleRemoveUsers}
//               className="w-full mt-4 bg-red-500 text-white p-2 rounded"
//               disabled={selectedUsersToRemove.length === 0}
//             >
//               Remove {selectedUsersToRemove.length} Member
//               {selectedUsersToRemove.length > 1 ? "s" : ""}
//             </button>
//           )}

//           {/* Leave Group Button */}
//           <button
//             onClick={handleLeaveGroup}
//             className="w-full mt-4 bg-yellow-500 text-white p-2 rounded"
//           >
//             Leave Group
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChatBox = () => {
//   const { selectedChat, setSelectedChat, user, setChats } = ChatState();
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

//   // Method to update chat after group modifications
//   const handleUpdateChat = (updatedChat) => {
//     if (updatedChat) {
//       setSelectedChat(updatedChat);
//       setChats((prevChats) =>
//         prevChats.map((chat) =>
//           chat._id === updatedChat._id ? updatedChat : chat
//         )
//       );
//     } else {
//       // If updatedChat is null (left group), clear selected chat
//       setSelectedChat(null);
//       setChats((prevChats) =>
//         prevChats.filter((chat) => chat._id !== selectedChat._id)
//       );
//     }
//   };

//   // Get user for one-to-one chat
//   const getOtherUser = () => {
//     return selectedChat.users.find((u) => u._id !== user._id);
//   };

//   return (
//     <div className={`md:w-[70%] ${selectedChat ? "block" : "hidden md:block"}`}>
//       {selectedChat ? (
//         <div className="flex flex-col h-full">
//           {/* Chat Header */}
//           <div className="bg-gray-100 p-4 flex justify-between items-center">
//             <div className="flex items-center">
//               {!selectedChat.isGroupChat ? (
//                 <img
//                   src={getOtherUser().pic}
//                   alt="User"
//                   className="h-10 w-10 rounded-full mr-3"
//                 />
//               ) : (
//                 <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center mr-3">
//                   <span className="text-white font-bold">
//                     {selectedChat.chatName[0]}
//                   </span>
//                 </div>
//               )}

//               <h2 className="text-xl font-semibold">
//                 {!selectedChat.isGroupChat
//                   ? getOtherUser().name
//                   : selectedChat.chatName}
//               </h2>
//             </div>

//             {/* Eye Icon for Details (Only for Group Chats) */}
//             {selectedChat.isGroupChat && (
//               <button
//                 onClick={() => setIsDetailsModalOpen(true)}
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 <EyeIcon className="h-6 w-6" />
//               </button>
//             )}
//           </div>

//           {/* Details Modal */}
//           {isDetailsModalOpen && selectedChat.isGroupChat && (
//             <GroupChatDetailsModal
//               chat={selectedChat}
//               user={user}
//               onClose={() => setIsDetailsModalOpen(false)}
//               onUpdateChat={handleUpdateChat}
//             />
//           )}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-full bg-gray-100">
//           <p className="text-gray-500 text-xl">
//             Select a chat to start messaging
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBox;
