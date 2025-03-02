import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getEvents, 
  getEventById, 
  createEvent as apiCreateEvent, 
  updateEvent as apiUpdateEvent, 
  deleteEvent as apiDeleteEvent 
} from "../../utils/api";
import api from "../../utils/api";  // Import API for fetchAllEvents

// Fetch upcoming events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await getEvents();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch events");
  }
});

// Fetch all events (admin)
export const fetchAllEvents = createAsyncThunk("events/fetchAllEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/events/all");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch all events");
  }
});

// Fetch single event by ID
export const fetchEventById = createAsyncThunk("events/fetchEventById", async (id, { rejectWithValue }) => {
  try {
    const response = await getEventById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch event");
  }
});

// Create an event
export const createEvent = createAsyncThunk("events/createEvent", async (data, { rejectWithValue }) => {
  try {
    const response = await apiCreateEvent(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to create event");
  }
});

// Update an event
export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const response = await apiUpdateEvent(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update event");
  }
});

// Delete an event
export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id, { rejectWithValue }) => {
  try {
    await apiDeleteEvent(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete event");
  }
});

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],       // Upcoming events
    allEvents: [],    // All events (admin)
    event: null,      // Single event details
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch all events (admin)
      .addCase(fetchAllEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.allEvents = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => { state.loading = true; })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })

      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) state.events[index] = action.payload;
      })

      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
