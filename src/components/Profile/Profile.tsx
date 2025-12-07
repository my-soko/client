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

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-blue-600 mb-6"
      >
        <span className="text-3xl mr-1 font-bold hover:underline">←</span>
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {user && (
        <div className="flex flex-col items-center gap-4">
          <img src={user.image} className="w-32 h-32 rounded-full border" />

          <p className="text-center">
            <strong>Name:</strong> {user.fullName}
          </p>
          <p className="text-center">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-center">
            <strong>WhatsApp:</strong> {user.whatsappNumber || "Not added"}
          </p>

          <Link
            to="/profile/update"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Update Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
