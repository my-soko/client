import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../api/axios";

const API_URL = "http://localhost:5000/api/favourite";

export interface Favourite {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
}

export interface FavouriteWithProduct extends Favourite {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export interface FavouriteState {
  length: number;
  favourites: FavouriteWithProduct[];
  loading: boolean;
  error?: string | null;
}

interface ErrorResponse {
  message: string;
}

const initialState: FavouriteState = {
  favourites: [],
  loading: false,
  error: null,
  length: 0
};

export const fetchFavourites = createAsyncThunk<
  FavouriteWithProduct[],
  void,
  { rejectValue: ErrorResponse }
>("favourites/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_URL, { withCredentials: true });
    return res.data.favourites as FavouriteWithProduct[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Error" });
  }
});

export const addFavourite = createAsyncThunk<
  FavouriteWithProduct,
  string,
  { rejectValue: ErrorResponse }
>("favourites/add", async (productId, { rejectWithValue }) => {
  try {
    const res = await api.post(
      API_URL,
      { productId },
      { withCredentials: true }
    );

    return res.data.favourite as FavouriteWithProduct;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Error" });
  }
});



// Remove favourite
export const removeFavourite = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>("favourites/remove", async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/${productId}`, {
      withCredentials: true,
    });
    return productId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Error" });
  }
});


const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Error fetching favourites";
      })

      // ADD
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.favourites.unshift(action.payload);
      })

      // REMOVE
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (fav) => fav.productId !== action.payload
        );
      });
  },
});

export const selectFavourites = (state: RootState) => state.favourites.favourites;


export default favouriteSlice.reducer;
