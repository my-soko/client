import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";

import { logoutUser } from "../../redux/reducers/authReducer";
import { categories } from "../../util/Category";

import {
  setBrandFilter,
  setCategoryFilter,
  setSearchQuery,
  setConditionFilter,
} from "../../redux/reducers/productReducer";

import { Menu, X, User, Heart } from "lucide-react";
import {
  fetchFavourites,
  selectFavourites,
} from "../../redux/reducers/favouriteSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const favourites = useSelector(selectFavourites);
  const categoryFilter = useSelector(
    (state: RootState) => state.product.categoryFilter
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) dispatch(fetchFavourites());
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpen(false);
  };

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600"
          onClick={() => {
            dispatch(setCategoryFilter(""));
            dispatch(setSearchQuery(""));
            dispatch(setBrandFilter(""));
            dispatch(setConditionFilter(""));
            setOpen(false);
          }}
        >
          MySoko
        </Link>

        {/* DESKTOP FILTER BAR */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />

          {/* CATEGORY */}
          <select
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* BRAND */}
          <select
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setBrandFilter(e.target.value))}
          >
            <option value="">Brand</option>
            {categories.map((cat) =>
              cat.name === categoryFilter
                ? cat.brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))
                : null
            )}
          </select>

          {/* CONDITION */}
          <select
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setConditionFilter(e.target.value))}
          >
            <option value="">Condition</option>
            <option value="BRAND_NEW">Brand New</option>
            <option value="SLIGHTLY_USED">Slightly Used</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>
        </div>

        {/* FAVOURITES */}
        {user && (
          <Link
            to="/favourites"
            onClick={() => setOpen(false)}
            className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-500"
          >
            <Heart className="w-6 h-6" />
            {favourites.length > 0 && (
              <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {favourites.length}
              </span>
            )}
            Favourite
          </Link>
        )}

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile">
                <img
                  src={user.image}
                  alt="profile"
                  className="w-10 h-10 rounded-full border cursor-pointer hover:scale-105 transition"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
              <User className="w-7 h-7" />
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-4 bg-white shadow-lg rounded-lg p-4 space-y-4">

          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />

          {/* CATEGORY */}
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* BRAND */}
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => dispatch(setBrandFilter(e.target.value))}
          >
            <option value="">Brand</option>
            {categories.map((cat) =>
              cat.name === categoryFilter
                ? cat.brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))
                : null
            )}
          </select>

          {/* CONDITION */}
          <select
            className="w-full border rounded-lg p-2"
            onChange={(e) => dispatch(setConditionFilter(e.target.value))}
          >
            <option value="">Condition</option>
            <option value="BRAND_NEW">Brand New</option>
            <option value="SLIGHTLY_USED">Slightly Used</option>
            <option value="REFURBISHED">Refurbished</option>
          </select>

          {/* NAV LINKS */}
          <nav className="flex flex-col gap-3 text-lg">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="hover:text-indigo-600"
            >
              Products
            </Link>

            {user && (
              <Link
                to="/favourites"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 hover:text-red-500"
              >
                <Heart className="w-6 h-6" />
                Favourites
                {favourites.length > 0 && (
                  <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {favourites.length}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* MOBILE AUTH */}
          <div className="pt-4 border-t">
            {user ? (
              <div className="flex items-center justify-between">
                <Link to="/profile" onClick={() => setOpen(false)}>
                  <img
                    src={user.image}
                    alt="profile"
                    className="w-12 h-12 rounded-full border"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
              >
                <User className="w-6 h-6" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
