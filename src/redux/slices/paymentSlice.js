import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../utils/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/payments/checkout", data);

      let paymentIntent = response.data;

      if (response.data.requiresAction) {
        const stripe = await stripePromise;
        const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
          response.data.clientSecret
        );

        if (error) throw error;
        if (confirmedIntent.status !== "succeeded") {
          throw new Error("3D Secure verification failed");
        }

        await api.post("/payments/confirm", {
          paymentIntentId: confirmedIntent.id,
        });

        paymentIntent = confirmedIntent;
      }

      return paymentIntent;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { error: "Payment failed" });
    }
  }
);

export const fetchUserPayments = createAsyncThunk(
  "payments/fetchUserPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/payments/user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { error: "Failed to fetch payments" });
    }
  }
);

const paymentSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPaymentStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
        state.success = true;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Error processing payment";
      })
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

export const { resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;