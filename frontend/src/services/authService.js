import { showToast } from "../utils/showToast";
import api from "./api";

export const register = async (username, email, password) => {
  try {
    const res = await api.post("api/register/", {
      username,
      email,
      password,
    });
    showToast(200, "Registered succussfully...");
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const res = await api.post("api/token/", {
      email,
      password,
    });
    console.log("res in authserice login", res);

    showToast(200, "Welcome Back!");
    return res.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const logout = async (refresh) => {
  try {
    const res = await api.post("api/logout/", { refresh: refresh });
    return res.data;
  } catch (error) {
    handleError(error);
  }
  showToast(200, "Thank You..");
};

const handleError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail || error.response.data?.error[0];

    if (status === 401) {
      showToast(400, "Unauthorized access.");
    } else {
      // showToast(status, detail || "An unexpected error occurred.");
    }
  } else {
    showToast(400, "Network error. Please try again.");
    console.error("Error:", error);
  }
};

export default {
  register,
  login,
  logout,
};
