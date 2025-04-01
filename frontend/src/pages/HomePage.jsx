import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        {isLogin ? (
          <Login setIsLogin={setIsLogin} />
        ) : (
          <Signup setIsLogin={setIsLogin} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
