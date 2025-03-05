import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, forgotPassword as apiForgotPassword } from "../../utils/api";
import api from "../../utils/api"; // Import API instance

// ✅ Fetch User Profile Thunk
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken; // Get token from state
      if (!token) throw new Error("Unauthorized");

      const response = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

// ✅ Login User Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const { accessToken, user } = response.data;

      // Store tokens and user data in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// ✅ Register User Thunk (Updated)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await register(data);
      const { accessToken, user } = response.data;

      // Store tokens and user data in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// ✅ Forgot Password Thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiForgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
  }
);

// ✅ Initial State with Safe localStorage Parsing
const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// Load user and token from localStorage safely
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    initialState.user = JSON.parse(storedUser);
  }

  const storedToken = localStorage.getItem("accessToken");
  if (storedToken) {
    initialState.accessToken = storedToken;
  }
} catch (error) {
  console.error("Error parsing stored user data:", error);
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}

// ✅ Auth Slice Definition
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ Forgot Password Cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ✅ Fetch User Profile Cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
