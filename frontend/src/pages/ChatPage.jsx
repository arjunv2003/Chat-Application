import React from "react";
import { Navigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox/ChatBox";
// import ChatBox from "../Components/ChatBox";

const ChatPage = () => {
  const { user, loading } = ChatState();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Redirect to home if no user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <SideDrawer />
      <div className="flex flex-1 overflow-hidden">
        <MyChats />
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;
