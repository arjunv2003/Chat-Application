import React, { useState } from "react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChatState } from "../../Context/ChatProvider";
import getBaseUrl, { baseUrl } from "../../Url";

const ProfileModal = ({ onClose }) => {
  const { user, setUser } = ChatState();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState(user.pic);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ChatApp");

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dmxkerpjf/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setPic(data.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${baseUrl()}/user/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name,
          pic,
        }),
      });

      const updatedUser = await response.json();

      const updatedUserInfo = {
        ...user,
        name: updatedUser.name,
        pic: updatedUser.pic,
        token: updatedUser.token, // important if token is refreshed
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setUser(updatedUserInfo);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
          <div className="relative mb-6">
            <img
              src={pic || "https://via.placeholder.com/150"}
              alt={name}
              className="h-36 w-36 rounded-full object-cover border-4 border-[#D76C82] shadow-lg"
            />
            {isEditing && (
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-0 right-0 bg-[#D76C82] text-white rounded-full p-2 cursor-pointer"
              >
                <PencilIcon className="h-5 w-5" />
                <input
                  type="file"
                  id="profile-pic-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-semibold text-center border rounded px-3 py-1 mb-2 text-[#8A0032] border-[#D76C82] focus:outline-none"
              disabled={loading}
              style={{ fontFamily: "'Underdog', cursive" }}
            />
          ) : (
            <h3
              className="text-2xl font-semibold text-[#8A0032] mb-1"
              style={{ fontFamily: "'Underdog', cursive" }}
            >
              {name}
            </h3>
          )}

          <p className="text-[#B03052] text-lg">{user.email}</p>

          <div className="flex space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#8A0032] text-white px-4 py-2 rounded hover:bg-[#6c0027] transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setPic(user.pic);
                  }}
                  disabled={loading}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#D76C82] text-white px-4 py-2 rounded hover:bg-[#b2586c] transition-colors flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
