import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

// 1. Fetch Notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/notifications");
      return response.data.data; // Array of notifications
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 2. Mark All as Read
export const markNotificationsAsRead = createAsyncThunk(
  "notifications/markRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.patch("/notifications/mark-read");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    isLoading: false,
  },
  reducers: {
    // Socket.io দিয়ে রিয়েল-টাইম নোটিফিকেশন আসলে এটা কল হবে
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        // Count unread (assuming backend sends 'isRead' field)
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(markNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;