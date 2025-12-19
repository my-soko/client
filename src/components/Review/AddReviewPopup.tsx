import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../redux/reducers/reviewSlice";
import type { AppDispatch } from "../../redux/store";

interface Props {
  productId: string;
  onClose: () => void;
}

const AddReviewPopup: React.FC<Props> = ({ productId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    await dispatch(createReview({ productId, rating, comment }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative shadow-2xl border border-gray-200 dark:border-gray-700">
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Add Your Review
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Rating:
            </span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 border border-gray-300 dark:border-gray-600 rounded p-2 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Comment:
            </span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 border border-gray-300 dark:border-gray-600 rounded p-2 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
              rows={4}
              required
            />
          </label>

          <button
            type="submit"
            className="bg-green-600 dark:bg-green-500 text-white py-2 rounded hover:bg-green-700 dark:hover:bg-green-400 font-medium transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewPopup;