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
  setMinPrice,
  setMaxPrice,
  setSortBy,
  clearAllFilters,
} from "../../redux/reducers/productReducer";

import { Menu, X, User, Heart, DollarSign } from "lucide-react";
import {
  fetchFavourites,
  selectFavourites,
} from "../../redux/reducers/favouriteSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const favourites = useSelector(selectFavourites);
  const { categoryFilter, filteredProducts, minPrice, maxPrice, sortBy } =
    useSelector((state: RootState) => state.product);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) dispatch(fetchFavourites());
  }, [dispatch, user]);

  // Product stats
  const totalProducts = filteredProducts.length;
  const brandNewCount = filteredProducts.filter(
    (p) => p.condition === "BRAND_NEW"
  ).length;
  const slightlyUsedCount = filteredProducts.filter(
    (p) => p.condition === "SLIGHTLY_USED"
  ).length;
  const refurbishedCount = filteredProducts.filter(
    (p) => p.condition === "REFURBISHED"
  ).length;

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpen(false);
  };

  return (
    <header className="bg-white md:w-full shadow-md sticky top-0 z-50">
      {/* TOP HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600"
          onClick={() => {
            dispatch(clearAllFilters());
            setOpen(false);
          }}
        >
          MySoko
        </Link>

        <div className="hidden md:flex flex-1 gap-2 items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 border rounded-lg p-2 border-gray-300"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />

          <select
            className="flex-1 border rounded-lg p-2 border-gray-300"
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="flex-1 border rounded-lg p-2 border-gray-300"
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
        </div>

        {/* Favourites */}
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
            Favourites
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

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className="bg-gray-50 p-4 hidden md:flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition">
            <span className="text-gray-600 font-semibold">Sort:</span>
            <select
              className="border-none outline-none focus:ring-0 bg-transparent"
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
            >
              <option value="">Default</option>
              <option value="latest">Latest</option>
              <option value="price_low_high">Price: Low → High</option>
              <option value="price_high_low">Price: High → Low</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition">
            <h1 className="w-8 h-5 mx-1 mb-1 text-green-500">KSH.</h1>
            <input
              type="number"
              placeholder="Min"
              className="w-20 border border-gray-200 rounded-lg p-1 focus:ring-2 focus:ring-indigo-500"
              value={minPrice || ""}
              onChange={(e) => dispatch(setMinPrice(Number(e.target.value)))}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-20 border border-gray-200 rounded-lg p-1 focus:ring-2 focus:ring-indigo-500"
              value={maxPrice || ""}
              onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
            />
          </div>

          {/* Condition Chips */}
          {["BRAND_NEW", "SLIGHTLY_USED", "REFURBISHED"].map((cond) => (
            <button
              key={cond}
              onClick={() => dispatch(setConditionFilter(cond))}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filteredProducts.some((p) => p.condition === cond)
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {cond.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Product Stats */}
        <div className="flex items-center gap-4 flex-wrap text-gray-700">
          <span className="text-sm font-medium">Listed: {totalProducts}</span>
          <span className="text-sm font-medium">
            Brand New: {brandNewCount}
          </span>
          <span className="text-sm font-medium">
            Slightly Used: {slightlyUsedCount}
          </span>
          <span className="text-sm font-medium">
            Refurbished: {refurbishedCount}
          </span>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg p-4 space-y-4">
          {/* SEARCH */}
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

          {/* PRICE FILTER */}
          <div className="flex items-center gap-2 mt-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              value={minPrice || ""}
              onChange={(e) => dispatch(setMinPrice(Number(e.target.value)))}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              value={maxPrice || ""}
              onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
            />
          </div>

          {/* SORT */}
          <select
            className="w-full border rounded-lg p-2 mt-2"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
          >
            <option value="">Sort By</option>
            <option value="latest">Latest</option>
            <option value="price_low_high">Price: Low → High</option>
            <option value="price_high_low">Price: High → Low</option>
          </select>

          {/* FAVOURITES */}
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

          {/* AUTH */}
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

          {/* PRODUCT STATS */}
          <div className="flex items-center gap-4 mt-4 text-gray-700 flex-wrap">
            <span>Listed: {totalProducts}</span>
            <span>Brand New: {brandNewCount}</span>
            <span>Slightly Used: {slightlyUsedCount}</span>
            <span>Refurbished: {refurbishedCount}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
