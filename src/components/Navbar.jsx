import { useState, useRef, useEffect } from "react";
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

const Navbar = () => {
  const { isLoggedIn, username, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const NavLink = ({ item }) => {
    const active = location.pathname === item.to;
    return (
      <Link to={item.to} className="relative font-semibold group">
        <span
          className={`transition-colors ${
            active ? "text-sky-400" : "text-orange-400 group-hover:text-sky-400"
          }`}
        >
          {item.name}
        </span>
        <span
          className={`absolute left-0 -bottom-1 w-full h-1 transition-opacity ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0 5 Q 5 0 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="transparent"
            />
          </svg>
        </span>
      </Link>
    );
  };

  return (
    <nav
      role="navigation"
      className="bg-[#1d1c20] text-white rounded-md px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between mx-2 sm:mx-6 lg:mx-20 relative z-30 "
    >
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Mentee logo" className="w-10 h-10 rounded-full" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500 font-bold tracking-wide text-xl">
          Mentee
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}
      </div>

      <div ref={profileRef} className="hidden md:flex items-center gap-4 relative z-50">
        {isLoggedIn ? (
          <>
            <span className="text-orange-400 font-semibold select-none capitalize">
              {username}
            </span>
            <button
              title="Profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((o) => !o)}
              className="p-1 rounded-full hover:bg-gray-700 transition"
            >
              <FaUserCircle size={28} className="text-orange-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-br from-[#2a2b30] to-[#1d1c20] rounded-lg shadow-lg ring-1 ring-[#2a2b30]/60"
              >
                <span className="absolute -top-2 right-5 w-3 h-3 rotate-45 bg-[#2a2b30]" />
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-5 py-3 hover:bg-sky-600/80 font-semibold rounded-t-lg"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    logoutUser();
                    toast.success("Logout Successfully");
                    navigate("/");
                  }}
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

      <button
        className="md:hidden z-50"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#1d1c20] rounded-b-md transition-all duration-300 overflow-hidden z-40 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block text-lg font-medium ${
                  location.pathname === item.to
                    ? "text-sky-400"
                    : "text-orange-400 hover:text-sky-400"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}

          <li>
            {isLoggedIn ? (
              <div className="flex flex-col items-center gap-2">
                {/* <span className="text-orange-300 font-semibold capitalize">
                  {username}
                </span> */}
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-md text-sm font-semibold"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    logoutUser();
                    toast.success("Logout Successfully");
                    navigate("/");
                  }}
                  className="text-red-400 hover:text-red-300 font-semibold mt-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-md text-sm font-semibold"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
