import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createBooking as apiCreateBooking } from "../../utils/api"; // Renamed API function
import api from "../../utils/api";

export const createBooking = createAsyncThunk(
    "bookings/createBooking",
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiCreateBooking(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserBookings = createAsyncThunk(
    "bookings/fetchUserBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/bookings/user");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
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
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

export default bookingSlice.reducer;