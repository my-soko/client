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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h1>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* FORGOT PASSWORD LINK */}
          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
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

          <p className="text-center text-gray-600 mt-3">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
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
