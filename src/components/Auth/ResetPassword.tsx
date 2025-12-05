import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/reducers/authReducer";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state:RootState) => state.auth);

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(resetPassword({ token: token!, newPassword }));
    if (resetPassword.fulfilled.match(res)) {
      setMsg("Password has been reset. You can now login.");
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

        {msg && <p className="text-green-600 mb-3 text-center">{msg}</p>}

        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2 rounded mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {msg && (
          <Link
            to="/login"
            className="block text-center text-blue-600 mt-4 hover:underline"
          >
            Go to login
          </Link>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
