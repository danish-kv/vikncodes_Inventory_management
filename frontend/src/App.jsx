import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./common/NotFoundPage";
import LandingPage from "./features/home/pages/LandingPage";
import { Toaster } from "react-hot-toast";
import OTPVerify from "./features/auth/pages/OTPVerify";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ProductPage from "./features/products/pages/ProductPage";
import AdminLoginPage from "./features/admin/pages/AdminLoginPage";
import AdminLayout from "./features/admin/layout/AdminLayout";
import AdminCategory from "./features/admin/pages/AdminCategory";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminProducts from "./features/admin/pages/AdminProducts";

const App = () => {
  return (
    <Router>
      <Toaster reverseOrder={false} />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPVerify />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductPage />} />


        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/users" element={<AdminLayout ><AdminUsers /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout ><AdminProducts /></AdminLayout>} />
        {/* <Route path="/admin/products" element={<AdminLayout ><AdminProductD /></AdminLayout>} /> */}
        <Route path="/admin/categories" element={<AdminLayout ><AdminCategory /></AdminLayout>} />


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
