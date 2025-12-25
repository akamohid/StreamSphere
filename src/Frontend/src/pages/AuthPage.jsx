import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import bgPic from "/public/bg_pic.png";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user.user);

  useEffect(() => {
    // Only redirect if user is actually authenticated (in Redux store)
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!searchParams.has("mode")) {
      setSearchParams({ mode: "login" });
      return;
    }
    const mode = searchParams.get("mode");
    if (mode !== "signup" && mode !== "login")
      setSearchParams({ mode: "login" });
  }, [searchParams]);

  const mode = searchParams.get("mode");
  const componentRendered = mode === "signup" ? <Signup /> : <Login />;

  return (
    <div
      className="w-screen h-screen bg-black bg-cover bg-center flex flex-col md:flex-row items-center justify-center p-6 md:p-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('${bgPic}')`,
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/25 z-0" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
        {/* Left Side Animated Heading */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col items-start justify-center text-left text-white w-full md:w-1/2 p-6 lg:p-12"
        >
          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4"
          >
            Welcome to Stream Sphere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-300 max-w-md"
          >
            Join our platform to explore, create, and share videos with the
            world in a sleek, immersive dark experience.
          </motion.p>
        </motion.div>
        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 max-w-md">{componentRendered}</div>
      </div>
    </div>
  );
}
