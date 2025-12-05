// src/components/Auth/VerifyEmail.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/auth/verify-email/${token}`,
          {
            withCredentials: true,
          }
        );

        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Verification error:", err.response?.data || err);
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed or link expired."
        );
      }
    };

    if (token) verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      {/* Loading State */}
      {status === "loading" && (
        <p className="text-lg text-gray-600">Verifying your email...</p>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-green-600 mb-3">✅ Verified!</h1>
          <p className="text-gray-700">{message}</p>

          <Link
            to="/login"
            className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Login
          </Link>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-3">
            ❌ Verification Failed
          </h1>
          <p className="text-gray-700">{message}</p>

          <Link
            to="/register"
            className="mt-6 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
