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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-900 p-4">
      {/* Loading State */}
      {status === "loading" && (
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Verifying your email...
        </p>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-3">
            ✅ Verified!
          </h1>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>

          <Link
            to="/login"
            className="mt-6 inline-block bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-400 transition font-medium"
          >
            Go to Login
          </Link>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-3">
            ❌ Verification Failed
          </h1>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>

          <Link
            to="/register"
            className="mt-6 inline-block bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition font-medium"
          >
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;