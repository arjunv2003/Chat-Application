import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ChatState } from "../../Context/ChatProvider";
import getBaseUrl from "../../Url";
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
      setLoading(false);
    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getBaseUrl()}/user/profile`, {
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

      // Update local storage and context
      const updatedUserInfo = {
        ...user,
        name: updatedUser.name,
        pic: updatedUser.pic,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setUser(updatedUserInfo);

      // Close editing mode
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Profile update failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-96 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={pic || "https://via.placeholder.com/150"}
              alt={name}
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mb-4"
            />
            {isEditing && (
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer"
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

          {/* Name Display/Edit */}
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-semibold text-center border rounded px-2 py-1 mb-2"
              disabled={loading}
            />
          ) : (
            <h3 className="text-xl font-semibold">{name}</h3>
          )}

          <p className="text-gray-600 mb-4">{user.email}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
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
