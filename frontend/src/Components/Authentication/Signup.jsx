import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import getBaseUrl from "../../Url";
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
      const response = await fetch(`${getBaseUrl()}/user`, {
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
      <div className="text-center mb-6">
        <div className="inline-block bg-[#B03052] p-1.5 rounded-full mb-2 shadow-lg">
          <span className="text-2xl">👻</span>
        </div>
        <h2 className="text-xl font-bold text-[#B03052]">Join ChatUp</h2>
        <p className="text-xs text-[#D76C82] mt-0.5">
          Create your account and start chatting
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-1.5 text-xs rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <svg
              className="h-3.5 w-3.5 text-[#D76C82]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // required
            className="w-full pl-8 pr-3 py-2 text-xs border-2 border-[#EBE8DB] bg-white rounded-lg focus:outline-none focus:border-[#D76C82] transition-colors"
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <svg
              className="h-3.5 w-3.5 text-[#D76C82]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // required
            className="w-full pl-8 pr-3 py-2 text-xs border-2 border-[#EBE8DB] bg-white rounded-lg focus:outline-none focus:border-[#D76C82] transition-colors"
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg
                className="h-3.5 w-3.5 text-[#D76C82]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // required
              className="w-full pl-8 pr-8 py-2 text-xs border-2 border-[#EBE8DB] bg-white rounded-lg focus:outline-none focus:border-[#D76C82] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#D76C82] hover:cursor-pointer"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-[#B03052] text-xs mt-0.5 pl-2">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <svg
              className="h-3.5 w-3.5 text-[#D76C82]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // required
            className="w-full pl-8 pr-3 py-2 text-xs border-2 border-[#EBE8DB] bg-white rounded-lg focus:outline-none focus:border-[#D76C82] transition-colors"
          />
          {password !== confirmPassword && confirmPassword.length > 0 && (
            <p className="text-[#B03052] text-xs mt-0.5 pl-2">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Profile Picture Upload - Simplified */}
        <div className="bg-[#ffffff] bg-opacity-30 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#D76C82]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#D76C82] bg-opacity-20 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-[#D76C82]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="relative">
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className={`py-1.5 px-2 rounded-lg border border-dashed flex items-center justify-center ${
                    uploading
                      ? "border-gray-300 bg-gray-50"
                      : "border-[#D76C82] hover:bg-[#D76C82] hover:bg-opacity-10"
                  } transition-colors`}
                >
                  <svg
                    className={`h-3 w-3 mr-1 ${
                      uploading ? "text-gray-400" : "text-[#D76C82]"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={`text-xs ${
                      uploading ? "text-gray-400" : "text-[#D76C82]"
                    }`}
                  >
                    {uploading
                      ? "Uploading..."
                      : profileImage
                      ? "Change photo"
                      : "Upload photo (optional)"}
                  </span>
                  {uploading && (
                    <svg
                      className="animate-spin ml-1 h-3 w-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:cursor-pointer ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#B03052] hover:bg-[#3D0301] shadow-md"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <p className="text-center mt-2 text-xs text-[#D76C82]">
        Already have an account?{" "}
        <button
          onClick={() => setIsLogin(true)}
          className="text-[#B03052] font-medium hover:underline hover:cursor-pointer"
        >
          Sign In
        </button>
      </p>

      <div className="mt-2 pt-1 border-t border-[#EBE8DB] text-center">
        <div className="flex items-center justify-center text-[10px] text-[#D76C82]">
          <span>Made with ❤️ by</span>
          <a
            href="https://arjunkanth-portfolio.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-[#B03052] font-medium hover:underline flex items-center"
          >
            Arjun
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2.5 w-2.5 ml-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default Signup;
