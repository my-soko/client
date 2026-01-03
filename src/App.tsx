import { Route, Routes } from "react-router-dom";
import AllProducts from "./components/Product/AllProducts";
import CreateProduct from "./components/Product/CreateProduct";
import RequireAuth from "./middleware/RequireAuth";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import ProductDetail from "./components/Product/ProductDetail";
import UpdateProduct from "./components/Product/UpdateProduct";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/Profile/UpdateProfile";
import VerifyEmail from "./components/Auth/VerifyEmail";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import type { AppDispatch } from "./redux/store";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./redux/reducers/authReducer";
import { useEffect } from "react";
import FavouritesPage from "./components/Favourite/FavouritesPage";
import CategoryProducts from "./components/Product/CategoryProducts";
import ShopsMapPage from "./components/Shop/ShopsMapPage";
import CreateShop from "./components/Shop/CreateShop";
import MyShops from "./components/Shop/MyShops";
import UpdateShop from "./components/Shop/UpdateShop";
import ShopDetail from "./components/Shop/ShopDetail";

const App = () => {
  // const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<AllProducts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/update" element={<UpdateProfile />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/shops-map" element={<ShopsMapPage />} />
        <Route path="/shops-map/:category" element={<ShopsMapPage />} />
        <Route path="/shops-map/product/:id" element={<ProductDetail />} />
        <Route
          path="/shops/create"
          element={
            <RequireAuth>
              <CreateShop />
            </RequireAuth>
          }
        />

        <Route
          path="/shops"
          element={
            <RequireAuth>
              <MyShops />
            </RequireAuth>
          }
        />

        <Route
          path="/shops/:id"
          element={
            <RequireAuth>
              <ShopDetail />
            </RequireAuth>
          }
        />

        <Route
          path="/create"
          element={
            <RequireAuth>
              <CreateProduct />
            </RequireAuth>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <RequireAuth>
              <UpdateProduct />
            </RequireAuth>
          }
        />

        <Route
          path="/shops/edit/:id"
          element={
            <RequireAuth>
              <UpdateShop />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
