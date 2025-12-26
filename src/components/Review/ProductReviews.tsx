import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviews,
  fetchUserReview,
} from "../../redux/reducers/reviewSlice";
import AddReviewPopup from "./AddReviewPopup";
import type { AppDispatch, RootState } from "../../redux/store";

const ProductReviews: React.FC<{
  productId: string;
  userId?: string;
  sellerId?: string;
}> = ({ productId, userId, sellerId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews = [], userReview } = useSelector(
    (state: RootState) => state.review
  );
  const [showPopup, setShowPopup] = useState(false);

  const isOwner = userId === sellerId;

  useEffect(() => {
    dispatch(fetchReviews(productId));
    dispatch(fetchUserReview(productId));
  }, [dispatch, productId]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
      >
        ★
      </span>
    ));

  return (
    <div className="mt-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-900 dark:text-white">
        Customer Reviews
      </h3>

      {/* Add Review Section */}
      {!isOwner && (
        <>
          {userReview ? (
            <p className="mb-4 text-green-600 dark:text-green-400 font-medium">
              You have already reviewed this product.
            </p>
          ) : (
            <button
              className="mb-6 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 dark:hover:bg-indigo-400 transition"
              onClick={() => setShowPopup(true)}
            >
              Add Review
            </button>
          )}
        </>
      )}

      {showPopup && (
        <AddReviewPopup
          productId={productId}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-900">
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                    {r.user?.profilePicture ? (
                      <img
                        src={r.user.profilePicture}
                        alt={r.user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-300 flex items-center justify-center h-full font-bold">
                        {r.user?.fullName?.charAt(0) || "A"}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {r.user?.fullName || "Anonymous"}
                    </p>
                    <div className="flex">{renderStars(r.rating)}</div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;