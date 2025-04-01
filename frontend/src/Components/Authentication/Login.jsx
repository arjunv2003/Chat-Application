import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const { setUser } = ChatState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestCredentials = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Update user in context
      setUser(data);

      // Navigate to chats
      setIsLoading(false);
      navigate("/chats");
    } catch (err) {
      console.error("Auth error", err);
      setError("Failed to authenticate. Try again later.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold text-center text-gray-700 mb-6">
        Login
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-3 rounded-md ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-4">
        New here?{" "}
        <button
          onClick={() => setIsLogin(false)}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      </p>
      <div>
        {/* Guest Credentials Button */}
        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={handleGuestCredentials}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Get Guest Credentials
          </button>
        </div>
        <div style={{ textAlign: "center" }}>Made By Arjun</div>
      </div>
    </>
  );
};

export default Login;
