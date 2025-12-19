import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { toast } from "react-hot-toast";

// ✅ NEW: Change Password Thunk
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/change-password", { oldPassword, newPassword });
      toast.success("Password updated successfully! 🔒");
      return response.data;
    } catch (error) {
      // toast.error is handled in UI or global interceptor usually, but here is safe too
      return rejectWithValue(error.response?.data?.message || "Password change failed");
    }
  }
);
// 1. Login Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      return response.data.data;
    } catch (error) {
      // ✅ Fix: Safe error handling
      return rejectWithValue(error.response?.data || { message: "Network Error" });
    }
  }
);

// 2. Register Thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      // নোট: যদি ব্যাকএন্ড রেজিস্টারের সাথে টোকেন না দেয়, তাহলে এখানে অটো-লগইন হবে না।
      // ধরে নিচ্ছি ব্যাকএন্ড ফিউচারে টোকেন দেবে অথবা ইউজারকে লগইন পেজে রিডাইরেক্ট করা হবে।
      return response.data.data; 
    } catch (error) {
      // ✅ Fix: Safe error handling
      return rejectWithValue(error.response?.data || { message: "Registration Failed" });
    }
  }
);

// 3. Load User Thunk
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Session Expired" });
    }
  }
);

// 4. Update Profile Thunk
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/auth/update-account", userData);
      toast.success("Profile updated successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      // ✅ Fix: Safe error handling
      return rejectWithValue(error.response?.data || { message: "Update Failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("accessToken") || null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN CASES ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // --- ✅ REGISTER CASES (NEWLY ADDED) ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // যদি ব্যাকএন্ড টোকেন রিটার্ন করে তবেই অটো লগইন হবে
        if (action.payload.accessToken) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // --- LOAD USER CASES ---
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("accessToken");
      })

      // --- UPDATE PROFILE CASES ---
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Live Update
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;