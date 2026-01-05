import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchShopById } from "../../redux/reducers/shopSlice";

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedShop, loading } = useSelector(
    (state: RootState) => state.shop
  );

  useEffect(() => {
    if (id) dispatch(fetchShopById(id));
  }, [dispatch, id]);

  if (loading || !selectedShop) {
    return <p className="text-center mt-10 text-white">Loading shop...</p>;
  }

  const shop = selectedShop;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 px-4 py-10">
      <div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate("/shops")}
        >
          Back to Shops
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
            {shop.description && (
              <p className="mt-2 text-gray-300">{shop.description}</p>
            )}
          </div>

          {/* Edit button */}
          <Link
            to={`/shops/edit/${shop.id}`}
            className="mt-4 md:mt-0 inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Edit Shop
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-200">
          <div>
            <p>
              <span className="font-medium text-white">Business Type:</span>{" "}
              {shop.businessType}
            </p>
            <p>
              <span className="font-medium text-white">Registration No:</span>{" "}
              {shop.registrationNo}
            </p>
            {shop.taxPin && (
              <p>
                <span className="font-medium text-white">Tax PIN:</span>{" "}
                {shop.taxPin}
              </p>
            )}
            <p>
              <span className="font-medium text-white">Phone:</span>{" "}
              {shop.phone}
            </p>
          </div>

          <div>
            {shop.email && (
              <p>
                <span className="font-medium text-white">Email:</span>{" "}
                {shop.email}
              </p>
            )}
            {shop.website && (
              <p className="truncate">
                <span className="font-medium text-white">Website:</span>{" "}
                <a
                  href={shop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {shop.website}
                </a>
              </p>
            )}
            <p>
              <span className="font-medium text-white">Address:</span>{" "}
              {shop.address}
            </p>
            <p>
              <span className="font-medium text-white">Last Updated:</span>{" "}
              {new Date(shop.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Verified Status */}
        <div className="mt-6 flex justify-end">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              shop.isVerified
                ? "bg-green-600/20 text-green-400"
                : "bg-yellow-600/20 text-yellow-400"
            }`}
          >
            {shop.isVerified ? "Verified Shop" : "Pending Verification"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
