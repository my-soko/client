import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 mt-20">
      <div className="max-w-8xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO & DESCRIPTION */}
        <div>
          <h2 className="text-xl font-semibold text-white">Marketplace</h2>
          <p className="mt-2 text-sm">
            Buy and sell products easily on our trusted marketplace.
          </p>
        </div>

        {/* ABOUT US SECTION */}
        <div>
          <h3 className="font-semibold text-white mb-2">About Us</h3>
          <p className="text-sm leading-relaxed">
            MySoko is a modern online marketplace designed to connect buyers and
            sellers quickly and safely. We provide a trusted platform for selling
            electronics, fashion, home goods, vehicles, and more — all in one place.
            Our mission is to make online trading simple, secure, and accessible 
            for everyone.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold text-white mb-2">Navigation</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/create" className="hover:text-white">Sell Product</Link></li>
            <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
          </ul>
        </div>

        {/* SOCIAL LINKS */}
        <div>
          <h3 className="font-semibold text-white mb-2">Connect</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-white">Facebook</a></li>
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      {/* AUTO SCROLLING STRIP */}
      <div className="overflow-hidden whitespace-nowrap py-4 mt-10 border-t border-gray-700">
        <div className="animate-marquee text-center text-gray-400 text-sm">
          ⭐ Buy and Sell Easily — Trusted by Thousands • Fast Delivery • Safe Marketplace • Connect with Buyers & Sellers ⭐
        </div>
      </div>

      <p className="text-center text-sm py-4 text-gray-500">
        © {new Date().getFullYear()} Marketplace. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
