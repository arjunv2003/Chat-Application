import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Signup = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const { setUser } = ChatState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ChatApp");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dmxkerpjf/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setProfileImage(data.secure_url);
      setUploading(false);
    } catch (err) {
      console.error("Upload failed", err);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: profileImage || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
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
      console.error("Signup error", err);
      setError("Failed to register. Try again later.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold text-center text-gray-700 mb-6">
        Sign Up
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
          />
          {password !== confirmPassword && confirmPassword.length > 0 && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label
            htmlFor="profilePic"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Picture (Optional)
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
          />

          {uploading && (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
              <p className="text-blue-500 text-sm">Uploading...</p>
            </div>
          )}

          {profileImage && (
            <div className="mt-2 flex justify-center">
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* Switch to Login */}
      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => setIsLogin(true)}
          className="text-blue-500 hover:underline font-semibold"
        >
          Log In
        </button>
      </p>
    </>
  );
};

export default Signup;
