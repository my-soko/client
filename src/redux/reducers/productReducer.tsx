import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/product";

// ----------------------------
// TYPES
// ----------------------------
export interface Seller {
  fullName: string;
  email: string;
  whatsappNumber?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stockInCount: number;
  status: string;
  quickSale: boolean;
  category: string;
  imageUrl: string;
  images: string[];
  sellerId: string;
  seller: Seller;
  averageRating?: number;
  totalReviews?: number;
  whatsappLink?: string;
}

interface ErrorResponse {
  message: string;
}

interface ProductState {
  products: Product[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredProducts: any[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  categoryFilter: string;
  searchQuery: string;
}

// ----------------------------
// INITIAL STATE
// ----------------------------
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  filteredProducts: [],
  loading: false,
  error: null,
  categoryFilter: "",
  searchQuery: "",
};

// ----------------------------
// FETCH ALL PRODUCTS
// ----------------------------
export const fetchProducts = createAsyncThunk<
  Product[], // success return type
  void, // argument type
  { rejectValue: ErrorResponse } // reject value type
>("product/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Product[]>(API_URL, { withCredentials: true });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const createProduct = createAsyncThunk<
  { message: string; product: Product },
  FormData,
  { rejectValue: ErrorResponse }
>("product/createProduct", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});


export const updateProduct = createAsyncThunk<
  { message: string; product: Product },
  { id: string; formData: FormData },
  { rejectValue: ErrorResponse }
>("product/updateProduct", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: ErrorResponse }
>("product/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get<Product>(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const deleteProduct = createAsyncThunk<
  { message: string; id: string },
  string,
  { rejectValue: ErrorResponse }
>("product/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
      state.filteredProducts = state.products
        .filter((p) =>
          state.categoryFilter
            ? p.category.toLowerCase() === state.categoryFilter.toLowerCase()
            : true
        )
        .filter((p) =>
          state.searchQuery
            ? p.title.toLowerCase().includes(state.searchQuery.toLowerCase())
            : true
        );
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.filteredProducts = state.products
        .filter((p) =>
          state.categoryFilter
            ? p.category.toLowerCase() === state.categoryFilter.toLowerCase()
            : true
        )
        .filter((p) =>
          state.searchQuery
            ? p.title.toLowerCase().includes(state.searchQuery.toLowerCase())
            : true
        );
    },
  },

  extraReducers: (builder) => {
    // FETCH ALL
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.filteredProducts = action.payload; // initially show all
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch products";
    });

    // CREATE
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload.product);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message || "Failed to create product. Try again.";
    });

    // UPDATE
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.map((p) =>
        p.id === action.payload.product.id ? action.payload.product : p
      );
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message || "Failed to update product. Try again.";
    });

    // FETCH BY ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload; // store the fetched product
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message || "Failed to fetch product details";
    });
    // DELETE PRODUCT
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product.id !== action.payload.id
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload?.message || "Failed to delete product. Try again.";
    });
  },
});
export const { setCategoryFilter, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
