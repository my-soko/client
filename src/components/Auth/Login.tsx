import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/reducers/authReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(res)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-gray-800 max-w-md w-full p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-3 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            className="border border-gray-300 dark:border-gray-600 p-3 w-full rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {/* FORGOT PASSWORD LINK */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-400 transition font-medium disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <GoogleButton
            onSuccess={() => {
              console.log("Google login success → redirecting...");
              navigate("/");
            }}
          />

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;