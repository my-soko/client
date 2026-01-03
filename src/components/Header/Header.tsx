// src/components/Header/Header.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { Store } from "lucide-react";

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
  const { user } = useSelector((state: RootState) => state.auth);
  const favourites = useSelector(selectFavourites);
  const {
    categoryFilter,
    filteredProducts,
    minPrice,
    maxPrice,
    sortBy,
    products,
  } = useSelector((state: RootState) => state.product);

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [showShopMap, setShowShopMap] = React.useState(false);
  const [showShopMenu, setShowShopMenu] = React.useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user) dispatch(fetchFavourites());
  }, [dispatch, user]);

  const lastScrollY = React.useRef(0);
  const ticking = React.useRef(false);
  const [showTopBar, setShowTopBar] = React.useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            // scrolling down → show
            setShowTopBar(true);
          } else {
            // scrolling up → hide
            setShowTopBar(false);
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Product statistics
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

  const totalSales = products.filter((p) => p.status === "sold").length;

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
<header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
       <div className={`w-full bg-indigo-600 text-white text-sm transition-transform duration-300 ${showTopBar ? "translate-y-0" : "-translate-y-full"}`}>

        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>📞 +254 716 570 983</span>
            <span className="hidden sm:inline">✉️ support@mysokochap.com</span>
          </div>

          <span className="hidden md:inline">
            Fast • Secure • Trusted Marketplace
          </span>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            dispatch(clearAllFilters());
            closeMobileMenu();
          }}
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          MySokoChap
        </Link>

        {/* Desktop Search & Filters */}
        <div className="hidden md:flex flex-1 max-w-2xl gap-3 items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />

          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          >
            <option
              value=""
              className="text-gray-900 dark:text-white dark:bg-gray-800"
            >
              Category
            </option>
            {categories.map((cat) => (
              <option
                className="text-gray-900 dark:text-white dark:bg-gray-800"
                key={cat.name}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => dispatch(setBrandFilter(e.target.value))}
          >
            <option
              value=""
              className="text-gray-900 dark:text-white dark:bg-gray-800"
            >
              Brand
            </option>
            {categories
              .find((cat) => cat.name === categoryFilter)
              ?.brands.map((brand) => (
                <option
                  className="text-gray-900 dark:text-white dark:bg-gray-800"
                  key={brand}
                  value={brand}
                >
                  {brand}
                </option>
              ))}
          </select>
        </div>

        <div className="relative inline-block">
          <button
            onClick={() => setShowShopMap((prev) => !prev)}
            className="py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            🗺️ Shops Map
          </button>
          {showShopMap && (
            <div className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 z-50 max-h-64 overflow-y-auto w-56">
              <button
                onClick={() => {
                  navigate("/shops-map");
                  setShowShopMap(false);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                All Pinned Shops
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    navigate(`/shops-map/${cat.name}`);
                    setShowShopMap(false);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {/* Favourites */}
          {user && (
            <Link
              to="/favourites"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {favourites.length > 0 && (
                <span className="absolute -mt-4 -mr-4 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {favourites.length}
                </span>
              )}
              <span className="hidden lg:inline">Favourites</span>
            </Link>
          )}

          {/* Shops Menu */}
          <div className="relative">
            <button
              onClick={() => setShowShopMenu((p) => !p)}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium"
            >
              <Store size={20} />
              Shops
            </button>

            {showShopMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden z-50">
                <Link
                  to="/shops-map"
                  onClick={() => setShowShopMenu(false)}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  🗺️ All Shops Map
                </Link>

                {user && (
                  <>
                    <Link
                      to="/shops"
                      onClick={() => setShowShopMenu(false)}
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🏬 My Shops
                    </Link>

                    <Link
                      to="/shops/create"
                      onClick={() => setShowShopMenu(false)}
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ➕ Create Shop
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition-colors"
            >
              <User className="w-7 h-7" />
              <span className="hidden lg:inline">Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Desktop Secondary Filters */}
      <div className="hidden md:block border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-4 py-2 shadow-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Sort:
              </span>

              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
              >
                <option value="" className="dark:bg-gray-800">
                  Sort By
                </option>
                <option value="latest" className="dark:bg-gray-800">
                  Latest
                </option>
                <option value="price_low_high" className="dark:bg-gray-800">
                  Price: Low → High
                </option>
                <option value="price_high_low" className="dark:bg-gray-800">
                  Price: High → Low
                </option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-4 py-2 shadow-sm">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ""}
                onChange={(e) =>
                  dispatch(setMinPrice(Number(e.target.value) || undefined))
                }
                className="w-24 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ""}
                onChange={(e) =>
                  dispatch(setMaxPrice(Number(e.target.value) || undefined))
                }
                className="w-24 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Condition Chips */}
            {["BRAND_NEW", "SLIGHTLY_USED", "REFURBISHED"].map((cond) => (
              <button
                key={cond}
                onClick={() => dispatch(setConditionFilter(cond))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filteredProducts.some((p) => p.condition === cond)
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                }`}
              >
                {cond.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>
              Listed:{" "}
              <strong className="text-gray-900 dark:text-white">
                {totalProducts}
              </strong>
            </span>
            <span>
              Brand New:{" "}
              <strong className="text-gray-900 dark:text-white">
                {brandNewCount}
              </strong>
            </span>
            <span>
              Slightly Used:{" "}
              <strong className="text-gray-900 dark:text-white">
                {slightlyUsedCount}
              </strong>
            </span>
            <span>
              Refurbished:{" "}
              <strong className="text-gray-900 dark:text-white">
                {refurbishedCount}
              </strong>
            </span>
            <span>
              Total Sales:{" "}
              <strong className="text-green-600 dark:text-green-400">
                {totalSales}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg">
          <div className="px-4 py-6 space-y-5">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent text-gray-900 dark:text-white"
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />

            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
              onChange={(e) => dispatch(setBrandFilter(e.target.value))}
            >
              <option value="">Brand</option>
              {categories
                .find((cat) => cat.name === categoryFilter)
                ?.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>

            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
              onChange={(e) => dispatch(setConditionFilter(e.target.value))}
            >
              <option value="">Condition</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="SLIGHTLY_USED">Slightly Used</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>

            <div className="flex gap-3">
              <DollarSign className="w-6 h-6 text-gray-500 dark:text-gray-400 mt-3" />
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice || ""}
                  onChange={(e) =>
                    dispatch(setMinPrice(Number(e.target.value) || undefined))
                  }
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice || ""}
                  onChange={(e) =>
                    dispatch(setMaxPrice(Number(e.target.value) || undefined))
                  }
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
            >
              <option value="" className="dark:bg-gray-800">
                Sort By
              </option>
              <option value="latest" className="dark:bg-gray-800">
                Latest
              </option>
              <option value="price_low_high" className="dark:bg-gray-800">
                Price: Low → High
              </option>
              <option value="price_high_low" className="dark:bg-gray-800">
                Price: High → Low
              </option>
            </select>

            {user && (
              <Link
                to="/favourites"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-500"
              >
                <Heart className="w-6 h-6" />
                <span>Favourites ({favourites.length})</span>
              </Link>
            )}

            <div className="border-t pt-4 space-y-3">
              <Link
                to="/shops-map"
                onClick={closeMobileMenu}
                className="block font-medium text-gray-700 dark:text-gray-300"
              >
                🗺️ All Shops Map
              </Link>

              {user && (
                <>
                  <Link
                    to="/shops/my"
                    onClick={closeMobileMenu}
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    🏬 My Shops
                  </Link>

                  <Link
                    to="/shops/create"
                    onClick={closeMobileMenu}
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    ➕ Create Shop
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4 border-t dark:border-gray-700 space-y-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link to="/profile" onClick={closeMobileMenu}>
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-gray-600"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 dark:text-red-400 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-indigo-500"
                >
                  <User className="w-6 h-6" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>
                Listed:{" "}
                <strong className="text-gray-900 dark:text-white">
                  {totalProducts}
                </strong>
              </p>
              <p>
                Brand New:{" "}
                <strong className="text-gray-900 dark:text-white">
                  {brandNewCount}
                </strong>
              </p>
              <p>
                Slightly Used:{" "}
                <strong className="text-gray-900 dark:text-white">
                  {slightlyUsedCount}
                </strong>
              </p>
              <p>
                Refurbished:{" "}
                <strong className="text-gray-900 dark:text-white">
                  {refurbishedCount}
                </strong>
              </p>
              <p>
                Total Sales:{" "}
                <strong className="text-green-600 dark:text-green-400">
                  {totalSales}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
