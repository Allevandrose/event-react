import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, deleteUser as apiDeleteUser } from "../../utils/api";

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Initiating fetchAllUsers request to /api/users");
      const response = await getAllUsers(); // Use imported function
      console.log("fetchAllUsers response:", response.data);
      return response.data;
    } catch (error) {
      console.error("fetchAllUsers error:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return rejectWithValue("Unauthorized - Please log in again");
          case 403:
            return rejectWithValue("Forbidden - Admin access required");
          case 404:
            return rejectWithValue("Users endpoint not found");
          default:
            return rejectWithValue(error.response.data?.error || "Failed to fetch users");
        }
      } else {
        return rejectWithValue("Network error - Unable to reach server");
      }
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteUser(id); // Use renamed import
      return id;
    } catch (error) {
      console.error("deleteUser error:", error);
      return rejectWithValue(error.response?.data?.error || "Failed to delete user");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
