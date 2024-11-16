import { createSlice } from "@reduxjs/toolkit";
import { LoginThunk, LogoutThunk, SignupThunk } from "../thunk/authThunk";

const initialState = {
  user: null,
  userID: null,
  profile: null,
  loading: false,
  error: null,
  otp_access: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleOtpAccess: (state, action) => {
      state.otp_access = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignupThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(SignupThunk.fulfilled, (state, action) => {
        console.log("signup thunk fulfilled ==", state, action);
        state.loading = false;
        state.user = action.payload.user;
        state.userID = action.payload.userID;
        state.error = null;
      })
      .addCase(SignupThunk.rejected, (state, action) => {
        console.log("signup thunk rejected ===", state, action);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LoginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(LoginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userID = action.payload.userID;
        state.profile = action.payload.profile;
        state.loading = false;
        state.error = null;
      })
      .addCase(LoginThunk.rejected, (state, action) => {
        console.log("login thunk rejected", state, action);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LogoutThunk.fulfilled, (state, action) => {
        state.user = null;
        state.userID = null;
        state.profile = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { toggleOtpAccess } = authSlice.actions;
export default authSlice.reducer;
