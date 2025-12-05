/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user: { fullName: string; profilePicture?: string };
}

interface ReviewState {
  reviews: Review[];
  userReview: Review | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  userReview: null,
  loading: false,
  error: null,
};

const API_URL = "http://localhost:5000/api/reviews";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/product/${productId}`);
      return res.data.reviews;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching reviews");
    }
  }
);

// Fetch current user review for a product
export const fetchUserReview = createAsyncThunk(
  "reviews/fetchUserReview",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/product/${productId}/user`);
      return res.data.review;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching user review");
    }
  }
);


// Create a new review
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (
    { productId, rating, comment }: { productId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${API_URL}`, { productId, rating, comment });
      return res.data.review;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message || "Error submitting review");
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearUserReview: (state) => {
      state.userReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchReviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchUserReview
      .addCase(fetchUserReview.fulfilled, (state, action: PayloadAction<Review | null>) => {
        state.userReview = action.payload;
      })
      // createReview
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.userReview = action.payload;
        state.reviews.unshift(action.payload); // add new review to list
      });
  },
});

export const { clearUserReview } = reviewSlice.actions;
export default reviewSlice.reducer;
