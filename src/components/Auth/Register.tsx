import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/reducers/authReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(res)) {
      setSuccessMsg(
        "Account created successfully! Please check your email to verify your account before logging in."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {successMsg && (
          <p className="text-green-600 text-center font-semibold mb-4">
            {successMsg}
          </p>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullName"
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email Address"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            <GoogleButton
              onSuccess={() => {
                console.log("Google login success → redirecting...");
                navigate("/");
              }}
            />

            <p className="text-center text-gray-600 mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
