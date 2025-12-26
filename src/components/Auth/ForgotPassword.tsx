import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { forgotPassword } from "../../redux/reducers/authReducer";

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(res)) {
      setMsg("Password reset link has been sent to your email.");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Forgot Password
        </h1>

        {msg && (
          <p className="text-green-600 dark:text-green-400 mb-3 text-center font-medium">
            {msg}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 dark:bg-indigo-500 text-white p-3 rounded hover:bg-indigo-700 dark:hover:bg-indigo-400 font-medium transition disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;