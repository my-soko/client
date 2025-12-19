import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/reducers/authReducer";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-slate-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Reset Password
        </h1>

        {msg && (
          <p className="text-green-600 dark:text-green-400 mb-3 text-center font-medium">
            {msg}
          </p>
        )}

        <input
          type="password"
          placeholder="New password"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded hover:bg-indigo-700 dark:hover:bg-indigo-400 font-medium transition disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {msg && (
          <Link
            to="/login"
            className="block text-center text-indigo-600 dark:text-indigo-400 mt-4 hover:underline font-medium"
          >
            Go to login
          </Link>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;