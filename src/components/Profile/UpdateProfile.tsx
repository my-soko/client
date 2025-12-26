import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { updateUserProfile } from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";

const UpdateProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsappNumber || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateUserProfile({ whatsappNumber, profilePicture: user?.image || "" }));
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Update Profile
      </h2>

      {/* Display Google profile image as read-only */}
      {user?.image && (
        <div className="flex justify-center mb-6">
          <img
            src={user.image}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 object-cover shadow-md"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="mb-1 font-medium text-gray-700 dark:text-gray-300">
            WhatsApp Number
          </span>
          <input
            type="text"
            placeholder="WhatsApp Number e.g +254712345678"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </label>

        <button
          type="submit"
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-400 transition font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;