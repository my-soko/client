import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/reducers/authReducer";
import type { AppDispatch, RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "./GoogleButton";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  duration?: number;
}> = ({ value, suffix = "", duration = 2.5 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    latest.toLocaleString() + suffix
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [count, value, duration]);

  return <motion.span>{displayText}</motion.span>;
};

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(res)) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/30 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Attractive Visual */}
        <div className="hidden lg:flex flex-col justify-center items-start text-left px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
          >
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">MySoko</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg"
          >
            Buy and sell anything in Kenya — phones, laptops, Electronics and more. 
            Trusted marketplace with real buyers and sellers.
          </motion.p>

          {/* Creative Illustrations + Animated Stats */}
          <div className="w-full max-w-2xl mx-auto space-y-12">
            <div className="grid grid-cols-2 gap-6">
              <img
                src="https://media.istockphoto.com/id/1175445207/vector/shopping-people.jpg?s=612x612&w=0&k=20&c=GybUaC0wmcbI2_obGpJe4bARvN65e4TaVsmJIT8aWXA="
                alt="Happy buyers and sellers in marketplace"
                className="rounded-2xl shadow-xl object-cover h-48"
              />
              <img
                src="https://static.vecteezy.com/system/resources/previews/015/511/781/non_2x/woman-doing-online-shopping-illustration-vector.jpg"
                alt="Customer browsing phones and laptops"
                className="rounded-2xl shadow-xl object-cover h-48"
              />
              <img
                src="https://media.istockphoto.com/id/1222588897/vector/shopping-online.jpg?s=612x612&w=0&k=20&c=Z7W5qIoyG7qZopneCsp01muJ9AzgnMC8nzlrs0ZqzWI="
                alt="Active users trading items"
                className="rounded-2xl shadow-xl object-cover h-48"
              />
              <img
                src="https://thumbs.dreamstime.com/b/customer-people-review-vector-illustration-cartoon-flat-happy-man-woman-characters-holding-rating-heart-likes-stars-183566694.jpg"
                alt="Satisfied customers"
                className="rounded-2xl shadow-xl object-cover h-48"
              />
            </div>

            {/* Animated Stats */}
            {isVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-8 justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800/70 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg text-center"
                >
                  <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    <AnimatedCounter value={10000} suffix="K+" duration={2.5} />
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active Listings</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white dark:bg-gray-800/70 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg text-center"
                >
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    <AnimatedCounter value={5000} suffix="K+" duration={2.5} />
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Happy Users</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Welcome Back
            </h1>

            {error && (
              <p className="text-red-500 dark:text-red-400 text-center mb-4 font-medium bg-red-50 dark:bg-red-900/30 py-3 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <input
                type="password"
                className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 dark:bg-indigo-500 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-400 transition shadow-lg disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="my-6 text-center text-gray-500 dark:text-gray-400">or</div>

              <GoogleButton onSuccess={() => navigate("/")} />

              <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;