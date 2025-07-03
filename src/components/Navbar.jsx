import { useState, useRef, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Compiler", to: "/compiler" },
  { name: "DSA", to: "/dsa" },
  { name: "Blogs", to: "/blogs" },
];

const DESKTOP_BREAKPOINT = 768;

const NavLink = memo(({ item, onClick }) => {
  const location = useLocation();
  const active = location.pathname === item.to;

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`font-semibold block w-full text-left px-1 py-2 ${
        active ? "text-sky-400" : "text-orange-400 hover:text-sky-400"
      }`}
    >
      {item.name}
    </Link>
  );
});

const Navbar = () => {
  const { isLoggedIn, username, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logoutUser();
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <nav className="bg-[#282828] text-white px-4 sm:px-6 lg:px-10 py-2 flex items-center justify-between relative z-30 lg:mx-18 mx-3 rounded-xl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Mentee logo" className="w-10 h-10 rounded-full" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500 font-bold tracking-wide text-xl">
          Mentee
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}
      </div>

      {/* Desktop Profile */}
      <div
        ref={profileRef}
        className="hidden md:flex items-center gap-4 relative"
      >
        {isLoggedIn ? (
          <>
            <span className="text-orange-400 font-semibold capitalize">
              {username}
            </span>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-700 transition"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              title="Profile Menu"
            >
              <FaUserCircle size={28} className="text-orange-400" />
            </button>

            {/* Framer Motion Animated Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  key="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-1 top-[110%] mt-2 w-48 bg-[#1f1f1f] rounded-md shadow-xl border border-[#333] z-50"
                >
                  {/* Arrow */}
                  <span className="absolute -top-1.5 right-6 w-3 h-3 rotate-45 bg-[#1f1f1f] border-t border-l border-[#333]" />
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-5 py-3 hover:bg-sky-600/80 font-medium text-sm text-white rounded-t-md"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-5 py-3 text-red-500 hover:text-white hover:bg-red-600 font-medium text-sm rounded-b-md"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-md text-sm font-semibold"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      {!mobileOpen && (
        <button
          className="md:hidden z-50"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <FaBars size={22} />
        </button>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#282828] shadow-lg transition-transform duration-300 z-40 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Mentee logo"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500 font-bold text-lg">
              Mentee
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white hover:text-gray-400"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-4 py-4 text-left">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              item={item}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <hr className="border-[#282828] my-2" />

          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  setMobileOpen(false);
                }}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold text-left"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="text-red-400 hover:text-red-300 font-semibold text-left px-4 mt-1"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMobileOpen(false);
              }}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-semibold text-left"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
