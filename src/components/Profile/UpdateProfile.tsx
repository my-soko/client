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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Update Profile</h2>

      {/* Display Google profile image as read-only */}
      {user?.image && (
        <div className="flex justify-center mb-6">
          <img
            src={user.image}
            alt="Profile"
            className="w-32 h-32 rounded-full border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">WhatsApp Number</span>
          <input
            type="text"
            placeholder="WhatsApp Number e.g +254712345678"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
