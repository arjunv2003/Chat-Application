// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChatState } from "../../Context/ChatProvider";
// import {
//   MagnifyingGlassIcon,
//   UserCircleIcon,
//   ArrowRightStartOnRectangleIcon,
//   XMarkIcon,
//   BellIcon,
//   BellAlertIcon,
// } from "@heroicons/react/24/outline";

// // ... (keep the ProfileModal component as is)

// const ProfileModal = ({ user, onClose }) => {
//   return (
//     <div
//       className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           onClose();
//         }
//       }}
//     >
//       <div
//         className="bg-white rounded-lg p-6 w-96 max-w-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-3xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-[Poppins] drop-shadow-md">
//             My Profile
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="flex flex-col items-center">
//           <img
//             src={user.pic}
//             alt={user.name}
//             className="h-32 w-32 rounded-full object-cover mb-4 border-4 border-gray-200"
//           />
//           <h3 className="text-xl font-semibold">{user.name}</h3>
//           <p className="text-gray-600">{user.email}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SideDrawer = () => {
//   const navigate = useNavigate();
//   const {
//     user,
//     setSelectedChat,
//     chats,
//     setChats,
//     notification,
//     setNotification,
//   } = ChatState();

//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
//   const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
//     useState(false);

//   const dropdownRef = useRef(null);
//   const profileImageRef = useRef(null);
//   const notificationRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         profileImageRef.current &&
//         !profileImageRef.current.contains(event.target)
//       ) {
//         setIsDropdownOpen(false);
//       }
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target)
//       ) {
//         setIsNotificationDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   const handleNotificationClick = (notification) => {
//     // Ensure the notification has a chat object
//     if (!notification || !notification.chat) {
//       console.error("Invalid notification", notification);
//       return;
//     }

//     // Set the selected chat
//     setSelectedChat(notification.chat);

//     // Remove this specific notification
//     setNotification((prevNotifications) =>
//       prevNotifications.filter((n) => n._id !== notification._id)
//     );

//     // Close notification dropdown
//     setIsNotificationDropdownOpen(false);
//   };

//   const handleSearch = async () => {
//     if (!search) {
//       alert("Please enter a name or email");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(
//         `https://chat-application-1795.onrender.com/api/user?search=${search}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       const data = await response.json();
//       setSearchResult(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Search error:", error);
//       setLoading(false);
//     }
//   };

//   const accessChat = async (userId) => {
//     try {
//       const response = await fetch(
//         "https://chat-application-1795.onrender.com/api/chat",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({ userId }),
//         }
//       );

//       const data = await response.json();

//       // If chat doesn't exist in chats, add it
//       if (!chats.find((c) => c._id === data._id)) {
//         setChats([data, ...chats]);
//       }

//       setSelectedChat(data);
//       setIsSearchDrawerOpen(false);
//     } catch (error) {
//       console.error("Error accessing chat:", error);
//     }
//   };

//   const handleLogout = () => {
//     const confirmLogout = window.confirm("Are you sure you want to logout?");
//     if (confirmLogout) {
//       localStorage.removeItem("userInfo");
//       navigate("/");
//     }
//   };

//   return (
//     <>
//       <div className="bg-white shadow-md flex justify-between items-center p-4">
//         {/* Search Button */}
//         {/* <div className="flex items-center">
//           <button
//             onClick={() => setIsSearchDrawerOpen(true)}
//             className="flex items-center text-gray-600 hover:text-gray-900"
//           >
//             <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
//             <span className="hidden md:block">Search & add users</span>
//           </button>
//         </div> */}
//         <div className="flex items-center">
//           <button
//             onClick={() => setIsSearchDrawerOpen(true)}
//             className="flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-medium transition-all duration-200 hover:border-gray-500 hover:text-black hover:bg-gray-100"
//           >
//             <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
//             <span className="hidden md:block">Search & Add Users</span>
//           </button>
//         </div>

//         {/* App Title */}
//         {/* <h1 className="text-2xl font-bold ">Chat Up 👻</h1> */}
//         <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-[Poppins] drop-shadow-lg">
//           <span>Chat Up</span> <span className="text-white">👻</span>
//         </h1>

//         {/* User Actions */}
//         <div className="flex items-center space-x-4">
//           {/* Notification Button */}
//           <div className="relative" ref={notificationRef}>
//             {/* <button
//               onClick={() =>
//                 setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
//               }
//               className="relative"
//             >
//               {notification.length > 0 ? (
//                 <BellAlertIcon className="h-6 w-6 text-red-500" />
//               ) : (
//                 <BellIcon className="h-6 w-6 text-gray-600" />
//               )}
//               {notification.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
//                   {notification.length}
//                 </span>
//               )}
//             </button> */}

//             <button
//               onClick={() =>
//                 setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
//               }
//               className="relative group"
//             >
//               {notification.length > 0 ? (
//                 <BellAlertIcon className="h-6 w-6 text-red-500 relative top-1 animate-bounce group-hover:animate-none transition-transform duration-200" />
//               ) : (
//                 <BellIcon className="h-6 w-6 text-gray-600 relative top-1 hover:text-black transition-colors duration-200" />
//               )}
//               {notification.length > 0 && (
//                 <span className="absolute -top-1.5 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold animate-pulse">
//                   {notification.length}
//                 </span>
//               )}
//             </button>

//             {isNotificationDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
//                 {notification.length === 0 ? (
//                   <div className="p-4 text-center text-gray-500">
//                     No new notifications
//                   </div>
//                 ) : (
//                   notification.map((notif) => (
//                     <div
//                       key={notif._id}
//                       onClick={() => handleNotificationClick(notif)}
//                       className="p-3 hover:bg-gray-100 cursor-pointer"
//                     >
//                       <p>
//                         New message from{" "}
//                         {notif.chat.isGroupChat
//                           ? notif.chat.chatName
//                           : notif.sender.name}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Profile Dropdown */}
//           <div className="relative">
//             <img
//               ref={profileImageRef}
//               src={user?.pic || "https://via.placeholder.com/40"}
//               alt={user?.name}
//               className="h-10 w-10 rounded-full cursor-pointer"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             />

//             {/* Dropdown Menu */}
//             {isDropdownOpen && (
//               <div
//                 ref={dropdownRef}
//                 className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10"
//               >
//                 <button
//                   className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
//                   onClick={() => {
//                     setIsProfileModalOpen(true);
//                     setIsDropdownOpen(false);
//                   }}
//                 >
//                   <UserCircleIcon className="h-5 w-5 mr-2" />
//                   My Profile
//                 </button>
//                 <button
//                   className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
//                   onClick={handleLogout}
//                 >
//                   <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-2" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Search Drawer */}
//       {isSearchDrawerOpen && (
//         <div className="fixed inset-0 z-50 flex">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black opacity-50"
//             onClick={() => setIsSearchDrawerOpen(false)}
//           ></div>

//           {/* Drawer Content */}
//           <div className="relative w-96 bg-white shadow-xl mr-auto h-full">
//             <div className="p-6">
//               {/* Drawer Header */}
//               <div className="flex justify-between items-center mb-6">
//                 {/* <h2 className="text-2xl font-bold">Search Users</h2> */}
//                 <h2 className="text-3xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-[Poppins] drop-shadow-md">
//                   Search Users
//                 </h2>
//                 <button
//                   onClick={() => setIsSearchDrawerOpen(false)}
//                   className="text-gray-600 hover:text-gray-900"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>

//               {/* Search Input */}
//               <div className="flex mb-4">
//                 <input
//                   type="text"
//                   placeholder="Search by name or email"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={handleSearch}
//                   disabled={loading}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
//                 >
//                   {loading ? "Searching..." : "Search"}
//                 </button>
//               </div>

//               {/* Search Results */}
//               <div className="space-y-4">
//                 {loading ? (
//                   <div className="flex justify-center items-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                   </div>
//                 ) : (
//                   searchResult.map((searchUser) => (
//                     <div
//                       key={searchUser._id}
//                       className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition"
//                       onClick={() => accessChat(searchUser._id)}
//                     >
//                       <img
//                         src={searchUser.pic || "https://via.placeholder.com/40"}
//                         alt={searchUser.name}
//                         className="h-10 w-10 rounded-full mr-4"
//                       />
//                       <div>
//                         <p className="font-semibold">{searchUser.name}</p>
//                         <p className="text-sm text-gray-600">
//                           {searchUser.email}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Profile Modal */}
//       {isProfileModalOpen && (
//         <ProfileModal
//           user={user}
//           onClose={() => setIsProfileModalOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default SideDrawer;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  XMarkIcon,
  BellIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

// Profile Modal component with premium styling
const ProfileModal = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-[#EBE8DB] rounded-lg p-8 w-96 max-w-md shadow-2xl border-2 border-[#D76C82]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-3xl font-bold text-[#8A0032] drop-shadow-sm"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            Your Profile
          </h2>
          <button
            onClick={onClose}
            className="text-[#3D0301] hover:text-[#8A0032] transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={user.pic}
            alt={user.name}
            className="h-36 w-36 rounded-full object-cover mb-6 border-4 border-[#D76C82] shadow-lg"
          />
          <h3
            className="text-2xl font-semibold text-[#8A0032] mb-1"
            style={{ fontFamily: "'Underdog', cursive" }}
          >
            {user.name}
          </h3>
          <p className="text-[#B03052] text-lg">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

const SideDrawer = () => {
  const navigate = useNavigate();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const dropdownRef = useRef(null);
  const profileImageRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification || !notification.chat) {
      console.error("Invalid notification", notification);
      return;
    }

    setSelectedChat(notification.chat);
    setNotification((prevNotifications) =>
      prevNotifications.filter((n) => n._id !== notification._id)
    );
    setIsNotificationDropdownOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter a name or email");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const response = await fetch(
        `https://chat-application-1795.onrender.com/api/user?search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const response = await fetch(
        "https://chat-application-1795.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setIsSearchDrawerOpen(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      setSelectedChat(null);
      localStorage.removeItem("userInfo");
      navigate("/");
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#EBE8DB] to-[#D76C82] shadow-lg flex justify-between items-center px-6 py-4 sticky top-0 z-40">
        {/* Search Button */}
        <div className="flex items-center">
          <button
            onClick={() => {
              setIsSearchDrawerOpen(true);
              setHasSearched(false);
              setSearch("");
              setSearchResult([]);
            }}
            className="flex items-center px-4 py-2.5 rounded-full bg-[#8A0032] text-[#EBE8DB] font-medium transition-all duration-200 hover:shadow-lg hover:opacity-90"
          >
            <MagnifyingGlassIcon className="h-5 w-5 md:mr-2" />
            <span className="hidden md:block">Find Friends</span>
          </button>
        </div>

        {/* App Title */}
        <h1
          className="text-3xl font-bold text-[#3D0301] drop-shadow-sm flex items-center"
          style={{ fontFamily: "'Underdog', cursive" }}
        >
          Chat Up <span className="ml-2 text-[#3D0301]">👻</span>
        </h1>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() =>
                setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
              }
              className="relative p-2 hover:bg-[#EBE8DB] hover:bg-opacity-30 rounded-full transition-colors"
            >
              {notification.length > 0 ? (
                <BellAlertIcon className="h-6 w-6 text-[#3D0301]" />
              ) : (
                <BellIcon className="h-6 w-6 text-[#3D0301]" />
              )}
              {notification.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3D0301] text-[#EBE8DB] rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {notification.length}
                </span>
              )}
            </button>

            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#EBE8DB] border-2 border-[#D76C82] rounded-lg shadow-xl z-10 overflow-hidden">
                <div
                  className="p-3 bg-[#8A0032] text-[#EBE8DB] font-semibold"
                  style={{ fontFamily: "'Underdog', cursive" }}
                >
                  Message Notifications
                </div>
                {notification.length === 0 ? (
                  <div className="p-4 text-center text-[#3D0301]">
                    No new messages
                  </div>
                ) : (
                  notification.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className="p-3 hover:bg-[#D76C82] hover:bg-opacity-20 cursor-pointer border-b border-[#D76C82] border-opacity-30 last:border-b-0"
                    >
                      <p className="text-[#3D0301]">
                        New message from{" "}
                        <span className="font-bold">
                          {notif.chat.isGroupChat
                            ? notif.chat.chatName
                            : notif.sender.name}
                        </span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              ref={profileImageRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer"
            >
              <img
                src={user?.pic || "https://via.placeholder.com/40"}
                alt={user?.name}
                className="h-10 w-10 rounded-full border-2 border-[#3D0301] hover:border-[#8A0032] transition-all duration-200 object-cover shadow-md"
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-56 bg-[#EBE8DB] border-2 border-[#D76C82] rounded-lg shadow-xl z-10 overflow-hidden"
              >
                <button
                  className="flex items-center w-full px-4 py-3 text-left text-[#EBE8DB] bg-[#8A0032] hover:bg-opacity-90 transition-colors"
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Your Profile</span>
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-left text-[#EBE8DB] bg-[#8A0032] hover:bg-opacity-90 transition-opacity"
                  onClick={handleLogout}
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Drawer */}
      {isSearchDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 backdrop-blur-md bg-opacity-40"
            onClick={() => setIsSearchDrawerOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm md:max-w-md bg-[#EBE8DB] shadow-2xl mr-auto h-full overflow-y-auto">
            <div className="p-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-[#D76C82]">
                <h2
                  className="text-2xl font-bold text-[#8A0032]"
                  style={{ fontFamily: "'Underdog', cursive" }}
                >
                  Discover New Connections
                </h2>
                <button
                  onClick={() => setIsSearchDrawerOpen(false)}
                  className="text-[#3D0301] hover:text-[#8A0032] p-2 rounded-full hover:bg-[#D76C82] hover:bg-opacity-20 transition-all"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Search Input */}
              <div className="flex mb-6">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-grow px-4 py-3 border-2 border-[#D76C82] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#8A0032] bg-[#EBE8DB] text-[#3D0301] placeholder-[#B03052] placeholder-opacity-60"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-5 py-3 bg-[#8A0032] text-[#EBE8DB] rounded-r-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D76C82] border-t-[#8A0032]"></div>
                  </div>
                ) : hasSearched ? (
                  searchResult.length > 0 ? (
                    searchResult.map((searchUser) => (
                      <div
                        key={searchUser._id}
                        className="flex items-center p-4 bg-[#D76C82] bg-opacity-10 rounded-lg hover:bg-opacity-30 cursor-pointer transition-all shadow-sm"
                        onClick={() => accessChat(searchUser._id)}
                      >
                        <img
                          src={
                            searchUser.pic || "https://via.placeholder.com/40"
                          }
                          alt={searchUser.name}
                          className="h-14 w-14 rounded-full mr-4 border-2 border-[#8A0032] object-cover shadow-md"
                        />
                        <div>
                          <p
                            className="font-semibold text-[#3D0301] text-lg"
                            style={{ fontFamily: "'Underdog', cursive" }}
                          >
                            {searchUser.name}
                          </p>
                          <p className="text-[#B03052]">{searchUser.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-[#8A0032]">
                      <p
                        className="text-xl font-medium"
                        style={{ fontFamily: "'Underdog', cursive" }}
                      >
                        No users found
                      </p>
                      <p className="mt-2">Try a different search term</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10">
                    <p
                      className="text-xl font-medium text-[#8A0032]"
                      style={{ fontFamily: "'Underdog', cursive" }}
                    >
                      Find Your Friends
                    </p>
                    <p className="mt-2 text-[#3D0301]">
                      Search to connect and start chatting!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
};

export default SideDrawer;
