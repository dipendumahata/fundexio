import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { toast } from "react-hot-toast";

// --- Async Thunks ---
export const bookAdvisorySession = createAsyncThunk(
  "marketplace/bookSession",
  async (bookingData, { rejectWithValue }) => {
    try {
      // bookingData: { serviceId, scheduledAt, notes }
      const response = await apiClient.post("/advisory/book", bookingData);
      toast.success("Session booked successfully! 📅");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
      return rejectWithValue(error.response?.data);
    }
  }
);
// 1. Fetch Proposals
export const fetchProposals = createAsyncThunk(
  "marketplace/fetchProposals",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/proposals", { params: filters });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch proposals");
    }
  }
);

// 2. Fetch Loans
export const fetchLoans = createAsyncThunk(
  "marketplace/fetchLoans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/loans");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch loans");
    }
  }
);

// 3. Fetch Advisors
export const fetchAdvisors = createAsyncThunk(
  "marketplace/fetchAdvisors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/advisory");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch advisors");
    }
  }
);

// 4. Create Proposal
export const createProposal = createAsyncThunk(
  "marketplace/createProposal",
  async (proposalData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/proposals", proposalData);
      toast.success("Proposal posted successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post proposal");
      return rejectWithValue(error.response?.data);
    }
  }
);

// 5. Create Loan Product
export const createLoanProduct = createAsyncThunk(
  "marketplace/createLoan",
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/loans", loanData);
      toast.success("Loan Product Created!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create loan");
      return rejectWithValue(error.response?.data);
    }
  }
);

// 6. Apply for Loan
export const applyForLoan = createAsyncThunk(
  "marketplace/applyLoan",
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/loans/apply", applicationData);
      toast.success("Application Submitted Successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Application Failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

// 7. Create Advisory Service
export const createAdvisoryService = createAsyncThunk(
  "marketplace/createAdvisoryService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/advisory/services", serviceData);
      toast.success("Service created successfully!");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create service");
      return rejectWithValue(error.response?.data);
    }
  }
);

// 8. Invest
export const investInProposal = createAsyncThunk(
  "marketplace/investInProposal",
  async ({ proposalId, amount }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/investments", { proposalId, amount });
      toast.success("Investment successful! 🎉");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Investment failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

// ✅ 9. Fetch Banker Applications (NEW)
export const fetchBankerApplications = createAsyncThunk(
  "marketplace/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/loans/applications");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch applications");
    }
  }
);

// ✅ 10. Update Loan Status (NEW)
export const updateLoanStatus = createAsyncThunk(
  "marketplace/updateLoanStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/loans/applications/${applicationId}/status`, { status });
      toast.success(`Application ${status.toLowerCase()}!`);
      return response.data.data;
    } catch (error) {
      toast.error("Failed to update status");
      return rejectWithValue(error.response?.data);
    }
  }
);

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState: {
    proposals: [],
    loans: [],
    advisors: [],
    applications: [], // 👈 ✅ THIS WAS MISSING! Fixed now.
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // General Loading/Error Handling could be optimized, but explicit for clarity
      .addCase(bookAdvisorySession.fulfilled, (state, action) => {
      // আমরা চাইলে এখানে বুকিং লিস্ট আপডেট করতে পারি, আপাতত শুধু টোস্ট দেখাচ্ছি
    })
      // Proposals
      .addCase(fetchProposals.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProposals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.proposals = action.payload;
      })
      .addCase(fetchProposals.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Loans
      .addCase(fetchLoans.pending, (state) => { state.isLoading = true; })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loans = action.payload;
      })

      // Advisors
      .addCase(fetchAdvisors.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAdvisors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advisors = action.payload;
      })

      // Banker Applications
      .addCase(fetchBankerApplications.pending, (state) => { state.isLoading = true; })
      .addCase(fetchBankerApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload; // ✅ Sets applications
      })

      // Update Loan Status
      .addCase(updateLoanStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })

      // Creations (Optimistic Updates)
      .addCase(createProposal.fulfilled, (state, action) => { state.proposals.unshift(action.payload); })
      .addCase(createLoanProduct.fulfilled, (state, action) => { state.loans.unshift(action.payload); })
      .addCase(createAdvisoryService.fulfilled, (state, action) => { state.advisors.unshift(action.payload); });
  },
});

export default marketplaceSlice.reducer;