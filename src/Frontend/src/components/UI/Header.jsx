import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import defaultChannelPic from "../../../public/icon-7797704_640.png";
import SidebarItem from "./SidebarItem";
import { apiFetch } from "../../utils/api";
import { userActions } from "../../store/user-slice";

export default function Header() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!userData) navigate("/auth?mode=login");
  }, [userData, navigate]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const response = await apiFetch('http://localhost:5000/refresh', {
      method: 'POST'
    });

    if(!response.ok)
      throw new Error('Cant logout');

    localStorage.removeItem('accessToken');

    dispatch(userActions.removeUser());

    navigate('/auth?mode=login');
  };

  const handleViewChannel = () => {
    navigate(`/channels/${userData._id}?tab=videos`);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  function handleSearchClick() {
    const query = inputRef.current.value;
    inputRef.current.value = "";
    navigate("/search?query=" + query);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-[10dvh] z-30 bg-gradient-to-r from-blue-900 via-black to-black shadow-lg backdrop-blur-md">
        <div className="w-full h-full mx-auto flex items-center justify-between pl-4 pr-7 py-3 md:py-4 relative">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-5">
            <button
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              onClick={toggleSidebar}
              className="text-blue-400 hover:text-blue-600 focus:outline-none"
            >
              <AnimatePresence exitBeforeEnter initial={false}>
                {sidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="w-7 h-7" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="w-7 h-7" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <h1
              onClick={() => {
                navigate("/");
              }}
              className="text-white cursor-pointer font-extrabold text-2xl tracking-wide select-none"
            >
              Stream <span className="text-blue-500">Sphere</span>
            </h1>
          </div>

          {/* Center: Search Bar */}
          <motion.div
            className="absolute top-[50%] left-[50%] -translate-[50%] hidden md:flex md:justify-start md:items-center"
            initial={{ width: 350 }}
            whileFocus={{ width: 400 }}
          >
            <input
              type="search"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              placeholder="Search videos"
              className="w-full bg-transparent border border-blue-600 rounded-full py-2 px-4 pl-10 text-blue-300 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-lg"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-[50%] -translate-y-[50%] text-blue-400 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              onClick={handleSearchClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>

          {/* Right: User avatar & dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.img
              src={userData?.channelImageURL || defaultChannelPic}
              alt="User Avatar"
              className="w-11 h-11 rounded-full object-cover border-2 border-blue-400 cursor-pointer shadow-lg"
              onClick={() => setDropdownOpen((v) => !v)}
              whileHover={{ scale: 1.1, boxShadow: "0 0 10px #3b82f6" }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-3 w-44 bg-gradient-to-tr from-blue-900 via-black to-black border border-blue-600 rounded-lg shadow-lg text-blue-200 font-semibold overflow-hidden"
                >
                  <button
                    onClick={handleViewChannel}
                    className="w-full text-left px-4 py-3 hover:bg-blue-700 transition-colors"
                  >
                    View Channel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-700 transition-colors text-red-400"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                onClick={toggleSidebar}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black backdrop-blur-sm z-20"
              />

              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-950 via-black to-black shadow-2xl z-30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between px-4 py-5 border-b border-blue-800">
                    <h2 className="text-white font-bold text-xl tracking-wide select-none">
                      Stream Sphere
                    </h2>
                    <button
                      aria-label="Close sidebar"
                      onClick={toggleSidebar}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="mt-6 space-y-4 px-4 text-blue-300 font-semibold">
                    <div className="space-y-2">
                      <p className="text-sm text-blue-500 uppercase tracking-wider">
                        Library
                      </p>
                      <SidebarItem
                        label="Watch History"
                        icon="History"
                        onClick={() =>
                          goTo(`/channels/${userData._id}?tab=history`)
                        }
                      />
                      <SidebarItem
                        label="Playlists"
                        icon="ListVideo"
                        onClick={() =>
                          goTo(`/channels/${userData._id}?tab=playlists`)
                        }
                      />
                    </div>

                    <div className="mt-6 space-y-2">
                      <p className="text-sm text-blue-500 uppercase tracking-wider">
                        Your Channel
                      </p>
                      <SidebarItem
                        label="My Videos"
                        icon="Video"
                        onClick={() =>
                          goTo(`/channels/${userData._id}?tab=videos`)
                        }
                      />
                      <SidebarItem
                        label="Upload"
                        icon="Upload"
                        onClick={() => goTo("/upload")}
                      />
                    </div>
                  </nav>
                </div>

                <div className="p-4 text-sm text-blue-500 border-t border-blue-800">
                  <p className="text-xs">&copy; 2025 Stream Sphere</p>
                  <p className="text-xs">All rights reserved</p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
