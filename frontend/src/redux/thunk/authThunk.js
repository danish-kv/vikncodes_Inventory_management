import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import api from "../../services/api";

export const LoginThunk = createAsyncThunk(
  "auth/Login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data.email, data.password);
      console.log('Login Thunkk===========',res);
      
      localStorage.setItem("access", res.access_token);
      localStorage.setItem("refresh", res.refresh_token);
      localStorage.setItem("user", res.user);
      return res;
    } catch (error) {
      console.log("Login Thunk error", error);
      return rejectWithValue(error);
    }
  }
);

export const SignupThunk = createAsyncThunk(
  "auth/Signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data.username, data.email, data.password);
      console.log("sign up res thunk ===", res);

      return res;
    } catch (error) {
      console.log("Singup Thunk error", error);
      return rejectWithValue(error);
    }
  }
);

export const LogoutThunk = createAsyncThunk("auth/Logout", async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    const res = await authService.logout(refresh);
    console.log("Logout thunk ===", res);
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    return res.data;
  } catch (error) {
    console.log("logout Thunk error", error);

    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    throw error;
  }
});