import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductType } from "../../util/productType";
import api from "../../api/axios";
import type { Shop } from "../../types/Shops";

const API_URL = "http://localhost:5000/api/product";

export interface Seller {
  address: string;
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
  brand: string;
  subItem?: string | null;
  warranty: string | null;
  condition: "BRAND_NEW" | "SLIGHTLY_USED" | "REFURBISHED";
  imageUrl: string;
  images: string[];
  sellerId: string;
  stockTotal: number;
  seller: Seller;
  productType: ProductType;
  shop: Shop | null;
  shopId?: string;
  averageRating?: number;
  totalReviews?: number;
  whatsappLink?: string;
  createdAt: string;
}

interface ErrorResponse {
  message: string;
}

interface ProductState {
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: "latest" | "price_low_high" | "price_high_low" | "";
  filteredProducts: Product[];
  products: Product[];
  clearFilter: boolean;
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  categoryFilter: string;
  searchQuery: string;
  brandFilter: string;
  conditionFilter: string;
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
  brandFilter: "",
  conditionFilter: "",
  minPrice: null,
  maxPrice: null,
  sortBy: "",
  clearFilter: false,
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
    const response = await api.get<Product[]>(API_URL, {
      withCredentials: true,
    });
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
    const response = await api.post(API_URL, formData, {
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
    const response = await api.put(`${API_URL}/${id}`, formData, {
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
    const response = await api.get<Product>(`${API_URL}/${id}`, {
      withCredentials: true,
    });
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
    const response = await api.delete(`${API_URL}/${id}`, {
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
    clearAllFilters(state) {
      state.categoryFilter = "";
      state.searchQuery = "";
      state.brandFilter = "";
      state.conditionFilter = "";
      state.minPrice = null;
      state.maxPrice = null;
      state.sortBy = "";
      state.clearFilter = true;

      // Reset filtered products to all products
      state.filteredProducts = state.products;
    },
    setMinPrice(state, action) {
      state.minPrice = action.payload;

      state.filteredProducts = state.products.filter((p) => {
        const meetsCategory = state.categoryFilter
          ? p.category.toLowerCase() === state.categoryFilter.toLowerCase()
          : true;

        const meetsSearch = state.searchQuery
          ? p.title.toLowerCase().includes(state.searchQuery.toLowerCase())
          : true;

        const meetsBrand = state.brandFilter
          ? p.brand?.toLowerCase() === state.brandFilter.toLowerCase()
          : true;

        const meetsCondition = state.conditionFilter
          ? p.condition?.toLowerCase() === state.conditionFilter.toLowerCase()
          : true;

        const meetsMin = state.minPrice ? p.price >= state.minPrice : true;

        const meetsMax = state.maxPrice ? p.price <= state.maxPrice : true;

        return (
          meetsCategory &&
          meetsSearch &&
          meetsBrand &&
          meetsCondition &&
          meetsMin &&
          meetsMax
        );
      });
    },

    setMaxPrice(state, action) {
      state.maxPrice = action.payload;

      state.filteredProducts = state.products.filter((p) => {
        const meetsCategory = state.categoryFilter
          ? p.category.toLowerCase() === state.categoryFilter.toLowerCase()
          : true;

        const meetsSearch = state.searchQuery
          ? p.title.toLowerCase().includes(state.searchQuery.toLowerCase())
          : true;

        const meetsBrand = state.brandFilter
          ? p.brand?.toLowerCase() === state.brandFilter.toLowerCase()
          : true;

        const meetsCondition = state.conditionFilter
          ? p.condition?.toLowerCase() === state.conditionFilter.toLowerCase()
          : true;

        const meetsMin = state.minPrice ? p.price >= state.minPrice : true;

        const meetsMax = state.maxPrice ? p.price <= state.maxPrice : true;

        return (
          meetsCategory &&
          meetsSearch &&
          meetsBrand &&
          meetsCondition &&
          meetsMin &&
          meetsMax
        );
      });
    },

    setSortBy(state, action) {
      state.sortBy = action.payload;

      if (action.payload === "latest") {
        state.filteredProducts = [...state.filteredProducts].sort(
          (a, b) => Number(b.id) - Number(a.id)
        );
      }

      if (action.payload === "price_low_high") {
        state.filteredProducts = [...state.filteredProducts].sort(
          (a, b) => a.price - b.price
        );
      }

      if (action.payload === "price_high_low") {
        state.filteredProducts = [...state.filteredProducts].sort(
          (a, b) => b.price - a.price
        );
      }
    },

    setConditionFilter(state, action) {
      state.conditionFilter = action.payload;

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
        )
        .filter((p) =>
          state.brandFilter
            ? p.brand?.toLowerCase() === state.brandFilter.toLowerCase()
            : true
        )
        .filter((p) =>
          state.conditionFilter
            ? p.condition?.toLowerCase() === state.conditionFilter.toLowerCase()
            : true
        );
    },

    setBrandFilter(state, action) {
      state.brandFilter = action.payload;

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
        )
        .filter((p) =>
          state.brandFilter
            ? p.brand?.toLowerCase() === state.brandFilter.toLowerCase()
            : true
        )
        .filter((p) =>
          state.conditionFilter
            ? p.condition?.toLowerCase() === state.conditionFilter.toLowerCase()
            : true
        );
    },

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
        )
        .filter((p) =>
          state.brandFilter
            ? p.brand?.toLowerCase() === state.brandFilter.toLowerCase()
            : true
        )
        .filter((p) =>
          state.conditionFilter
            ? p.condition?.toLowerCase() === state.conditionFilter.toLowerCase()
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
        )
        .filter((p) =>
          state.brandFilter
            ? p.brand?.toLowerCase() === state.brandFilter.toLowerCase()
            : true
        )
        .filter((p) =>
          state.conditionFilter
            ? p.condition?.toLowerCase() === state.conditionFilter.toLowerCase()
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

      // Apply category filter if it exists
      if (state.categoryFilter) {
        state.filteredProducts = action.payload.filter(
          (p) => p.category.toLowerCase() === state.categoryFilter.toLowerCase()
        );
      } else {
        state.filteredProducts = action.payload;
      }
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
      state.currentProduct = action.payload;
      state.error = null;
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
export const {
  setCategoryFilter,
  setSearchQuery,
  setBrandFilter,
  setConditionFilter,
  setMinPrice,
  setMaxPrice,
  setSortBy,
  clearAllFilters,
} = productSlice.actions;
export default productSlice.reducer;
