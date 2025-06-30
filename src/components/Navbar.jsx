import { useState, useRef, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

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
    <nav className="bg-[#1d1c20] text-white px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between relative z-30 lg:mx-18 mx-3 rounded-xl">
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
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2b30] rounded-lg shadow-lg ring-1 ring-[#2a2b30]/60">
                <span className="absolute -top-2 right-5 w-3 h-3 rotate-45 bg-[#2a2b30]" />
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-5 py-3 hover:bg-sky-600/80 font-semibold rounded-t-lg"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-5 py-3 text-red-400 hover:bg-red-700/80 rounded-b-lg font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
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
      {/* Mobile Sidebar (Right Slide) */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#1d1c20] shadow-lg transition-transform duration-300 z-40 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header: Logo + Close Icon */}
        {/* Sidebar Header: Logo + Close Icon */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
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

        {/* Nav Items */}
        <div className="flex flex-col gap-2 px-4 py-4 text-left">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              item={item}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <hr className="border-gray-600 my-2" />

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
