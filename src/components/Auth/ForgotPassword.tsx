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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>

        {msg && <p className="text-green-600 mb-3">{msg}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
