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
import getBaseUrl from "../../Url";
import ProfileModal from "./ProfileModal";

import { toast } from "react-toastify";

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
      toast.error("Please enter a name or email");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const response = await fetch(`${getBaseUrl()}/user?search=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

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
      const response = await fetch(`${getBaseUrl()}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      });

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
