import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createBooking as apiCreateBooking } from "../../utils/api";  // ✅ Renamed API function

export const createBooking = createAsyncThunk("bookings/createBooking", async (data, { rejectWithValue }) => {
  try {
    const response = await apiCreateBooking(data);  // ✅ Calls the API correctly
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

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
      });
  },
});

export default bookingSlice.reducer;
