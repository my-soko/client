import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchProfile } from "../../redux/reducers/authReducer";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) return <div className="p-6 text-gray-700 dark:text-gray-300">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-indigo-600 dark:text-indigo-400 mb-6 hover:underline font-medium"
      >
        <span className="text-3xl mr-1 font-bold">←</span> Back to Home
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        My Profile
      </h2>

      {user && (
        <div className="flex flex-col items-center gap-6">
          <img
            src={user.image}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 dark:border-gray-600 object-cover shadow-lg"
          />

          <div className="space-y-4 text-center">
            <p className="text-lg">
              <strong className="text-gray-800 dark:text-gray-200">Name:</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">{user.fullName}</span>
            </p>
            <p className="text-lg">
              <strong className="text-gray-800 dark:text-gray-200">Email:</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            </p>
            <p className="text-lg">
              <strong className="text-gray-800 dark:text-gray-200">WhatsApp:</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {user.whatsappNumber || "Not added"}
              </span>
            </p>
          </div>

          <Link
            to="/profile/update"
            className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white font-semibold rounded-lg shadow-md transition"
          >
            Update Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;