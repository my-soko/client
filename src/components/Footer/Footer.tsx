import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black dark:from-gray-950 dark:to-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            MySoko
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Buy and sell products easily on our trusted marketplace. Safe
            transactions, real sellers, real buyers.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-white hover:text-black transition"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-white hover:text-black transition"
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-white hover:text-black transition"
              aria-label="X (Twitter)"
            >
              <FaXTwitter size={16} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-white hover:text-black transition"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={16} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-white hover:text-black transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-3">About Us</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            MySoko is a modern online marketplace designed to connect buyers and
            sellers quickly and safely. We bring electronics, fashion, vehicles,
            home goods, and more — all in one secure platform.
          </p>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <span className="text-gray-500">Email:</span>{" "}
              <a
                href="mailto:info@mysoko.co.ke"
                className="hover:text-white transition"
              >
                info@mysoko.co.ke
              </a>
            </li>
            <li>
              <span className="text-gray-500">WhatsApp:</span>{" "}
              <a
                href="https://wa.me/254716570983"
                className="hover:text-white transition"
              >
                +254 716 570 983
              </a>
            </li>
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Post an Ad
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="overflow-hidden whitespace-nowrap py-4 border-t border-gray-800">
        <div className="animate-marquee text-sm text-gray-400">
          ⭐ Buy & Sell Easily — Trusted by Thousands • Fast Deals • Secure
          Payments • MySoko Marketplace ⭐
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center py-5 text-sm text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} MySoko. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;