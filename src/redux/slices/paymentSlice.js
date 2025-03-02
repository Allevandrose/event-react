import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPayment as apiCreatePayment, getUserPayments } from "../../utils/api";

// ✅ Create Payment
export const createPayment = createAsyncThunk("payments/createPayment", async (data, { rejectWithValue }) => {
  try {
    const response = await apiCreatePayment(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: "Payment failed" });
  }
});

// ✅ Fetch User Payments
export const fetchUserPayments = createAsyncThunk("payments/fetchUserPayments", async (_, { rejectWithValue }) => {
  try {
    const response = await getUserPayments();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { error: "Failed to fetch payments" });
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Create Payment Cases
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error processing payment";
      })

      // ✅ Fetch User Payments Cases
      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error fetching payments";
      });
  },
});

export default paymentSlice.reducer;
