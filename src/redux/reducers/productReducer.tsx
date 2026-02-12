import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductColor, ProductType } from "../../util/productType";
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
  colors?: ProductColor[] | null;
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
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

// ----------------------------
// FETCH ALL PRODUCTS
export const fetchProducts = createAsyncThunk<
  {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  },
  {
    search?: string;
    category?: string;
    brand?: string;
    page?: number;
    limit?: number;
  },
  { rejectValue: ErrorResponse }
>("product/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await api.get(API_URL, {
      params,
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
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.page = 1;
    },

    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
      state.page = 1;
    },

    setBrandFilter(state, action) {
      state.brandFilter = action.payload;
      state.page = 1;
    },

    setConditionFilter(
      state,
      action: { payload: ProductState["conditionFilter"] },
    ) {
      state.conditionFilter = action.payload;
      state.page = 1;
    },

    setMinPrice(state, action: { payload: ProductState["minPrice"] }) {
      state.minPrice = action.payload;
      state.page = 1;
    },

    setMaxPrice(state, action: { payload: ProductState["maxPrice"] }) {
      state.maxPrice = action.payload;
      state.page = 1;
    },

    setPage(state, action) {
      state.page = action.payload;
    },

    setSortBy(state, action: { payload: ProductState["sortBy"] }) {
      state.sortBy = action.payload;
    },

    clearAllFilters(state) {
      state.searchQuery = "";
      state.categoryFilter = "";
      state.brandFilter = "";
      state.conditionFilter = "";
      state.minPrice = null;
      state.maxPrice = null;
      state.sortBy = "";
      state.page = 1;
    },

    filterProducts(state) {
      let filtered = [...state.products];

      if (state.searchQuery) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(state.searchQuery.toLowerCase()),
        );
      }

      if (state.categoryFilter) {
        filtered = filtered.filter((p) => p.category === state.categoryFilter);
      }

      if (state.brandFilter) {
        filtered = filtered.filter((p) => p.brand === state.brandFilter);
      }

      if (state.conditionFilter) {
        filtered = filtered.filter(
          (p) => p.condition === state.conditionFilter,
        );
      }

      if (state.minPrice !== null) {
        const minPrice = state.minPrice; 
        filtered = filtered.filter((p) => p.price >= minPrice);
      }

      if (state.maxPrice !== null) {
        const maxPrice = state.maxPrice;
        filtered = filtered.filter((p) => p.price <= maxPrice);
      }

      // Sorting
      if (state.sortBy === "latest") {
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      } else if (state.sortBy === "price_low_high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (state.sortBy === "price_high_low") {
        filtered.sort((a, b) => b.price - a.price);
      }

      state.filteredProducts = filtered;
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
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
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
        p.id === action.payload.product.id ? action.payload.product : p,
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
        (product) => product.id !== action.payload.id,
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
  clearAllFilters,
  filterProducts,
  setSortBy,
  setPage,
} = productSlice.actions;
export default productSlice.reducer;
