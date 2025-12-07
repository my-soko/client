import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface PaymentData {
  paymentId: string;
  checkoutRequestId: string;
}

interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentData: PaymentData | null;
  paid: boolean;
}

interface InitiatePaymentArgs {
  userId: string;
  productId: string;
  phone: string;
  productData: FormData;
}
const initialState: PaymentState = {
  loading: false,
  error: null,
  paymentData: null,
  paid: false,
};
const API_URL = "http://localhost:5000/api/payment";
// Async thunk for initiating STK Push
export const initiatePayment = createAsyncThunk<
  PaymentData,
  InitiatePaymentArgs,
  { rejectValue: string }
>("payment/initiate", async ({ userId, phone, productData }, { rejectWithValue }) => {
  try {
    const payload = {
      userId,
      phone,
      productData: Object.fromEntries(productData.entries())  // <-- convert FormData to JSON
    };

    const response = await axios.post(`${API_URL}/initiate`, payload);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});



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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action: PayloadAction<PaymentData>) => {
        state.loading = false;
        state.paymentData = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Payment failed";
      });
  },
});

export const { markPaid, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
