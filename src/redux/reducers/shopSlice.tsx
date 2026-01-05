import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Shop } from "../../types/Shops";

const API_URL = "http://localhost:5000/api/shops";

interface ShopState {
  myShops: Shop[];
  allShops: Shop[];   
  selectedShop: Shop | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  myShops: [],
  allShops: [], 
  selectedShop: null,
  loading: false,
  error: null,
};

export const createShop = createAsyncThunk<
  Shop,
  FormData,
  { rejectValue: string }
>("shop/create", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(API_URL, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Create shop failed");
  }
});

export const updateShop = createAsyncThunk<
  Shop,
  { id: string; data: FormData },
  { rejectValue: string }
>("shop/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Update shop failed");
  }
});


export const fetchMyShops = createAsyncThunk<
  Shop[],
  void,
  { rejectValue: string }
>("shop/myShops", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/getMyShops`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return rejectWithValue("Failed to fetch shops");
  }
});

export const fetchShopById = createAsyncThunk<
  Shop,
  string,
  { rejectValue: string }
>("shop/byId", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch {
    return rejectWithValue("Shop not found");
  }
});

export const fetchAllShops = createAsyncThunk<
  Shop[],
  void,
  { rejectValue: string }
>("shop/all", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch {
    return rejectWithValue("Failed to fetch all shops");
  }
});



const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    clearSelectedShop(state) {
      state.selectedShop = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.loading = false;
        state.myShops.push(action.payload);
      })
      .addCase(createShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // UPDATE
      .addCase(updateShop.fulfilled, (state, action) => {
        const index = state.myShops.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) state.myShops[index] = action.payload;
        state.selectedShop = action.payload;
      })

      // FETCH MY SHOPS
      .addCase(fetchMyShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyShops.fulfilled, (state, action) => {
        state.loading = false;
        state.myShops = action.payload;
      })
      .addCase(fetchMyShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // FETCH BY ID
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.selectedShop = action.payload;
      })
      .addCase(fetchAllShops.pending, (state) => {
  state.loading = true;
})
.addCase(fetchAllShops.fulfilled, (state, action) => {
  state.loading = false;
  state.allShops = action.payload;
})
.addCase(fetchAllShops.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || null;
});

  },
});

export const { clearSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
