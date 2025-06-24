import React from "react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-white px-6 pt-16 pb-6 mt-10 text-sm overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12">
        {/* ───────────── Left : link columns ───────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-16">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-2">Company</h3>
            <div className="text-gray-400 space-y-1">
              <p>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
              </p>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h3 className="font-semibold text-white mb-2">Quick Access</h3>
            <div className="text-gray-400 space-y-1">
              <p>
                <a href="#" className="hover:text-white transition">
                  DSA Sheet
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Blogs
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  CS Subjects
                </a>
              </p>
            </div>
          </div>

          {/* DSA Sheets */}
          <div>
            <h3 className="font-semibold text-white mb-2">DSA Sheets</h3>
            <div className="text-gray-400 space-y-1">
              <p>
                <a href="#" className="hover:text-white transition">
                  SDE Sheet
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Core Sheet
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Projects
                </a>
              </p>
            </div>
          </div>

          {/* Playlists */}
          <div>
            <h3 className="font-semibold text-white mb-2">Playlists</h3>
            <div className="text-gray-400 space-y-1">
              <p>
                <a href="#" className="hover:text-white transition">
                  Array Series
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  Graph Series
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  DP Series
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-white transition">
                  LinkedList Series
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ───────────── Right : brand + icons ───────────── */}
        <div className="relative text-center md:text-right space-y-4">
          {/* Glowing background */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 w-72 h-72 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 blur-3xl opacity-20 animate-ping pointer-events-none" />

          {/* Icons row */}
          <div className="flex justify-center md:justify-end gap-3 pb-1 relative z-10">
            {[
              { href: "https://linkedin.com", Icon: FaLinkedinIn },
              { href: "https://instagram.com", Icon: FaInstagram },
              { href: "https://youtube.com", Icon: FaYoutube },
              { href: "https://twitter.com", Icon: FaTwitter },
            ].map(({ href, Icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                           text-gray-400 hover:text-white hover:bg-white/20
                           transition-all ease-in-out duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Brand name */}
          <h2 className="relative z-10 text-white font-bold text-xl tracking-wider">
            MENTEE
          </h2>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © 2025 <span className="text-white font-semibold">Mentee</span>. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
