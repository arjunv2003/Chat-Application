import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import Header from "../Components/Authentication/Header";

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
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Chat-themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3D0301] to-[#B03052] z-0">
        {/* Chat bubble patterns - responsive sizes */}
        <div className="absolute top-[5%] left-[5%] w-12 h-12 sm:w-20 sm:h-20 bg-white opacity-5 rounded-tl-xl rounded-tr-xl rounded-br-xl"></div>
        <div className="absolute top-[20%] right-[10%] w-16 h-10 sm:w-32 sm:h-16 bg-white opacity-5 rounded-tl-xl rounded-tr-xl rounded-bl-xl"></div>
        <div className="absolute bottom-[15%] left-[20%] w-14 h-14 sm:w-24 sm:h-24 bg-white opacity-5 rounded-tl-xl rounded-tr-xl rounded-br-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-10 h-10 sm:w-16 sm:h-16 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-[25%] right-[8%] w-16 h-8 sm:w-28 sm:h-14 bg-white opacity-5 rounded-tl-xl rounded-tr-xl rounded-bl-xl"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Auth Container - more compact and responsive */}
      <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-xl w-[90%] max-w-[360px] sm:max-w-[380px] z-10">
        {isLogin ? (
          <Login setIsLogin={setIsLogin} />
        ) : (
          <Signup setIsLogin={setIsLogin} />
        )}
      </div>

      {/* Chat illustration for larger screens only */}
      <div className="hidden lg:block absolute right-[10%] top-1/2 transform -translate-y-1/2 z-0">
        <div className="relative">
          {/* Stylized chat bubbles */}
          <div className="absolute -left-16 -top-20 w-32 h-16 bg-white bg-opacity-10 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-lg"></div>
          <div className="absolute -right-12 top-10 w-40 h-20 bg-[#EBE8DB] bg-opacity-10 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-lg"></div>
          <div className="absolute left-0 top-40 w-36 h-16 bg-white bg-opacity-10 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-lg"></div>

          {/* Ghost emoji in a bubble */}
          <div className="absolute right-0 -top-10 w-24 h-24 bg-[#B03052] bg-opacity-20 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">👻</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
