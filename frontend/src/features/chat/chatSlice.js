import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { toast } from "react-hot-toast";

// 1. Fetch Sidebar Conversations
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/chat/conversations");
      // ❌ আগে ছিল: return response.data; (এটা পুরো অবজেক্ট দিচ্ছিল)
      // ✅ এখন হবে: response.data.data (শুধুমাত্র অ্যারেটা নেব)
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load chats");
    }
  }
);

// 2. Fetch Chat History (Specific Conversation)
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchHistory",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/chat/history/${conversationId}`);
      // ✅ এখানেও response.data.data হবে
      return { conversationId, messages: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load messages");
    }
  }
);

// 3. Send Message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ receiverId, content }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post("/chat/send", { receiverId, content });
      
      dispatch(fetchConversations());
      
      // ✅ এখানেও response.data.data
      return response.data.data; 
    } catch (error) {
      toast.error("Failed to send message");
      return rejectWithValue(error.response?.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [], // এটা অবশ্যই Array হতে হবে
    activeConversationId: null,
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Conversations
      .addCase(fetchConversations.pending, (state) => { state.isLoading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        // চেক করছি এটা আসলেই অ্যারে কিনা, না হলে এম্পটি অ্যারে
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.conversations = []; // এরর হলে এম্পটি অ্যারে
      })
      
      // Chat History
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = Array.isArray(action.payload.messages) ? action.payload.messages : [];
        state.activeConversationId = action.payload.conversationId;
      })

      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setActiveConversation, addMessage } = chatSlice.actions;
export default chatSlice.reducer;