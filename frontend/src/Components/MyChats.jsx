// import React, { useState, useEffect } from "react";
// import { ChatState } from "../Context/ChatProvider";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import GroupChatModal from "./GroupChatModal";

// const MyChats = () => {
//   const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

//   const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false);

//   const fetchChats = async () => {
//     try {
//       const response = await fetch(
//         "https://chat-application-1795.onrender.com/api/chat",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       const data = await response.json();
//       setChats(data);
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//     }
//   };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   const getSenderName = (loggedUser, users) => {
//     return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
//   };

//   const getSenderPic = (loggedUser, users) => {
//     return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
//   };

//   return (
//     <div
//       className={`md:w-[30%] bg-white border-r flex flex-col h-full ${
//         selectedChat ? "hidden md:flex" : "flex"
//       }`}
//     >
//       {/* My Chats Heading with Plus Button */}
//       <div className="p-4 bg-gray-100 flex justify-between items-center">
//         {/* <h2 className="text-2xl font-bold">My Chats</h2> */}
//         <h4 className="text-3xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-[Poppins] drop-shadow-md">
//           My Chats
//         </h4>
//         <button
//           onClick={() => setIsGroupChatModalOpen(true)}
//           className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
//         >
//           <PlusIcon className="h-5 w-5" />
//         </button>
//       </div>

//       <div className="p-3 space-y-2 overflow-y-auto flex-1">
//         {chats.map((chat) => (
//           <div
//             key={chat._id}
//             onClick={() => setSelectedChat(chat)}
//             className={`
//               flex items-center p-3 rounded-lg cursor-pointer
//               ${
//                 selectedChat?._id === chat._id
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }
//             `}
//           >
//             {!chat.isGroupChat ? (
//               <img
//                 src={getSenderPic(user, chat.users)}
//                 alt="User"
//                 className="h-10 w-10 rounded-full mr-3"
//               />
//             ) : (
//               <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center mr-3">
//                 <span className="text-white font-bold">{chat.chatName[0]}</span>
//               </div>
//             )}

//             <div>
//               <h3 className="font-semibold">
//                 {!chat.isGroupChat
//                   ? getSenderName(user, chat.users)
//                   : chat.chatName}
//               </h3>
//               {chat.latestMessage && (
//                 <p className="text-sm truncate">{chat.latestMessage.content}</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Group Chat Modal */}
//       {isGroupChatModalOpen && (
//         <GroupChatModal
//           onClose={() => setIsGroupChatModalOpen(false)}
//           fetchChats={fetchChats}
//         />
//       )}
//     </div>
//   );
// };

// export default MyChats;

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
          className="bg-[#8A0032] text-[#EBE8DB] p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 hover:shadow-lg"
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
              className={`
                flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm
                ${
                  selectedChat?._id === chat._id
                    ? "bg-[#8A0032] text-[#EBE8DB]"
                    : "bg-[#D76C82] bg-opacity-20 hover:bg-opacity-40"
                }
              `}
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
