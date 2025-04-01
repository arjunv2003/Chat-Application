import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { ChatState } from "./Context/ChatProvider";

const App = () => {
  const { loading } = ChatState();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chats" element={<ChatPage />} />
    </Routes>
  );
};

export default App;
