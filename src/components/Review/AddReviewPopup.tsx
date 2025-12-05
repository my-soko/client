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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Add Your Review</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 border rounded p-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 border rounded p-2"
              rows={4}
              required
            />
          </label>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewPopup;
