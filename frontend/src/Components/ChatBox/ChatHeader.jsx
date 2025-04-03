// import React from "react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// const ChatHeader = ({ selectedChat, user, onDetailsClick }) => {
//   // Get user for one-to-one chat
//   const getOtherUser = () => {
//     return selectedChat.users.find((u) => u._id !== user._id);
//   };

//   return (
//     <div className="bg-gray-100 p-4 flex justify-between items-center">
//       <div className="flex items-center">
//         {!selectedChat.isGroupChat ? (
//           <img
//             src={getOtherUser().pic}
//             alt="User"
//             className="h-10 w-10 rounded-full mr-3"
//           />
//         ) : (
//           <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center mr-3">
//             <span className="text-white font-bold">
//               {selectedChat.chatName[0]}
//             </span>
//           </div>
//         )}

//         <h2 className="text-xl font-semibold">
//           {!selectedChat.isGroupChat
//             ? getOtherUser().name
//             : selectedChat.chatName}
//         </h2>
//       </div>

//       {/* Eye Icon for Details (Only for Group Chats) */}
//       {selectedChat.isGroupChat && (
//         <button
//           onClick={onDetailsClick}
//           className="text-gray-600 hover:text-gray-900"
//         >
//           <EyeIcon className="h-6 w-6" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default ChatHeader;

// import React from "react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// const ChatHeader = ({ selectedChat, user, onDetailsClick }) => {
//   // Get user for one-to-one chat
//   const getOtherUser = () => {
//     return selectedChat.users.find((u) => u._id !== user._id);
//   };

//   return (
//     <div className="bg-gradient-to-r from-[#EBE8DB] to-[#D76C82] p-3 md:p-4 flex justify-between items-center shadow-md border-b border-[#D76C82]">
//       <div className="flex items-center">
//         {!selectedChat.isGroupChat ? (
//           <img
//             src={getOtherUser().pic}
//             alt={getOtherUser().name}
//             className="h-10 w-10 md:h-12 md:w-12 rounded-full mr-3 border-2 border-[#8A0032] object-cover shadow-sm"
//           />
//         ) : (
//           <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#8A0032] flex items-center justify-center mr-3 shadow-sm border-2 border-[#8A0032]">
//             <span
//               className="text-[#EBE8DB] font-bold text-lg md:text-xl"
//               style={{ fontFamily: "'Underdog', cursive" }}
//             >
//               {selectedChat.chatName[0].toUpperCase()}
//             </span>
//           </div>
//         )}

//         <div>
//           <h2
//             className="text-lg md:text-xl font-semibold text-[#3D0301] truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
//             style={{ fontFamily: "'Underdog', cursive" }}
//           >
//             {!selectedChat.isGroupChat
//               ? getOtherUser().name
//               : selectedChat.chatName}
//           </h2>

//           {selectedChat.isGroupChat && (
//             <p className="text-xs text-[#8A0032]">
//               {selectedChat.users.length} members
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Eye Icon for Details (Only for Group Chats) */}
//       {selectedChat.isGroupChat && (
//         <button
//           onClick={onDetailsClick}
//           className="text-[#3D0301] hover:text-[#8A0032] transition-colors p-2 rounded-full hover:bg-[#D76C82] hover:bg-opacity-20"
//           aria-label="View group details"
//           title="View group details"
//         >
//           <EyeIcon className="h-5 w-5 md:h-6 md:w-6" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default ChatHeader;

import React from "react";
import { EyeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

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

      {/* Eye Icon for Details (Only for Group Chats) */}
      {selectedChat.isGroupChat && (
        <button
          onClick={onDetailsClick}
          className="text-[#3D0301] hover:text-[#8A0032] transition-colors p-2 rounded-full hover:bg-[#D76C82] hover:bg-opacity-20"
          aria-label="View group details"
          title="View group details"
        >
          <EyeIcon className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
