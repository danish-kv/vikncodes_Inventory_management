import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./common/NotFoundPage";
import LandingPage from "./features/home/pages/LandingPage";
import { Toaster } from "react-hot-toast";
import OTPVerify from "./features/auth/pages/OTPVerify";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";

const App = () => {
  return (
    <Router>
      <Toaster reverseOrder={false} />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPVerify />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
