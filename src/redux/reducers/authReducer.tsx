/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000/auth";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  image?: string;
  whatsappNumber?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

// REGISTER
export const registerUser = createAsyncThunk<
  User,
  { fullName: string; email: string; password: string },
  { rejectValue: any }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Registration failed");
  }
});

// LOGIN
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: any }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Login failed");
  }
});

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk<
  User,
  { token: string },
  { rejectValue: any }
>("auth/googleLogin", async ({ token }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/google-login`, { token });
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Google login failed");
  }
});

// FORGOT PASSWORD
export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: any }
>("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/forgot-password`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Failed to send reset link");
  }
});

// RESET PASSWORD
export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; newPassword: string },
  { rejectValue: any }
>("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/reset-password`, data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Password reset failed");
  }
});

// FETCH PROFILE
export const fetchProfile = createAsyncThunk<User>(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/profileInfo`, {
        withCredentials: true,
      });
      const user = res.data.user;
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        whatsappNumber: user.whatsappNumber,
        image: user.profilePicture, // map profilePicture → image
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk<
  User,
  { whatsappNumber: string; profilePicture: string }
>("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_URL}/profile`, data);
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

// LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await axios.post(`${API_URL}/logout`);
});

// ====================== SLICE ======================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          fullName: action.payload.fullName,
          email: action.payload.email,
          role: action.payload.role,
          whatsappNumber: action.payload.whatsappNumber,
          // Use profilePicture from backend, fallback to picture from Google if empty
          image: action.payload.profilePicture || action.payload.picture,
        };
        state.isAuthenticated = true;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // FETCH PROFILE
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // UPDATE PROFILE
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      )

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
