import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchMyShops } from "../../redux/reducers/shopSlice";

const MyShops = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { myShops, loading } = useSelector((state: RootState) => state.shop);

  useEffect(() => {
    dispatch(fetchMyShops());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading shops...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-white">My Shops</h2>

      {myShops.length === 0 ? (
        <p className="text-gray-300">You have not created any shops yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myShops.map((shop) => (
            <Link
              key={shop.id}
              to={`/shops/${shop.id}`}
              className="block bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                {shop.description || "No description"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyShops;
