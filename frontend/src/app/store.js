import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import marketplaceReducer from "../features/marketplace/marketplaceSlice";
import chatReducer from "../features/chat/chatSlice";
import notificationReducer from "../features/notification/notificationSlice"; // ✅ Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    marketplace: marketplaceReducer,
    chat: chatReducer,
    notifications: notificationReducer, // ✅ Add this
  },
});