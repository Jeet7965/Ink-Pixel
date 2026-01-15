import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/ApiUrl";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const { data } = await api.get("http://localhost:5000/api/users");
  return data;
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
