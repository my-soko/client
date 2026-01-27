import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ProductPayload } from "../../types/product";
import api from "../../api/axios";


// Response from /initiate endpoint
interface PaymentResponse {
  paymentId: string;
  checkoutRequestId: string;
}

// Redux state
interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentData: PaymentResponse | null;
  paid: boolean;
  fee: number;
  basePrice: number;
}

// Thunk argument type
interface InitiatePaymentArgs {
  userId: string;
  productId: string;
  phone: string;
  productData: ProductPayload;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  paymentData: null,
  paid: false,
  fee: 0,
  basePrice: 0,
};

const API_URL = "http://localhost:5000/api/payment";

// Async thunk: Initiate M-Pesa STK Push
export const initiatePayment = createAsyncThunk<
  PaymentResponse,
  InitiatePaymentArgs,
  { rejectValue: string }
>(
  "payment/initiate",
  async ({ userId, phone, productData }, { rejectWithValue }) => {
    try {
      const response = await api.post<PaymentResponse>(`${API_URL}/initiate`, {
        userId,
        phone,
        productData,
      });

      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to initiate payment";
      return rejectWithValue(message);
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    markPaid: (state) => {
      state.paid = true;
    },
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentData = null;
      state.paid = false;
      state.fee = 0;
      state.basePrice = 0;
    },
    setFee: (
      state,
      action: PayloadAction<{ basePrice: number; fee: number }>
    ) => {
      state.basePrice = action.payload.basePrice;
      state.fee = action.payload.fee;
    },
    setPaymentData: (state, action: PayloadAction<PaymentResponse>) => {
      state.paymentData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Payment initiation failed";
      });
  },
});

export const { markPaid, resetPayment, setFee, setPaymentData } =
  paymentSlice.actions;

export default paymentSlice.reducer;