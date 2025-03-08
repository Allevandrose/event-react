import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // Ensure API utility is correctly imported

// Create a booking
export const createBooking = createAsyncThunk(
    "bookings/createBooking",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post("/bookings", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { error: "Booking failed" }
            );
        }
    }
);

// Fetch user bookings
export const fetchUserBookings = createAsyncThunk(
    "bookings/fetchUserBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/bookings/user");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { error: "Failed to fetch bookings" }
            );
        }
    }
);

const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create Booking Cases
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new request
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Booking failed"; // Safe error handling
            })

            // Fetch User Bookings Cases
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Failed to fetch bookings";
            });
    },
});

export default bookingSlice.reducer;
