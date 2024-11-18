import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Common Pages
import NotFoundPage from "./common/NotFoundPage";
import NotAuthorizedPage from "./common/NotAuthorizedPage";

// Auth Pages
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import OTPVerify from "./features/auth/pages/OTPVerify";

// User Pages
import LandingPage from "./features/home/pages/LandingPage";
import ProductPage from "./features/products/pages/ProductPage";

// Admin Pages
import AdminLoginPage from "./features/admin/pages/AdminLoginPage";
import AdminLayout from "./features/admin/layout/AdminLayout";
import AdminCategory from "./features/admin/pages/AdminCategory";
import AdminUsers from "./features/admin/pages/AdminUsers";
import AdminProducts from "./features/admin/pages/AdminProducts";
import ProductDetails from "./features/admin/pages/ProductDetails";

// Route Protection Components
import AuthProtection from "./route/AuthProtection";
import ProtectedRoute from "./route/ProductedRoute";

const App = () => {
  return (
    <Router>
      <Toaster reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/unauthorized" element={<NotAuthorizedPage />} />
        <Route path="/otp" element={<OTPVerify />} />

        {/* Auth Routes - Accessible only when NOT logged in */}
        <Route
          path="/register"
          element={
            <AuthProtection element={<RegisterPage />} redirectTo="/" />
          }
        />
        <Route
          path="/login"
          element={
            <AuthProtection element={<LoginPage />} redirectTo="/" />
          }
        />
        <Route
          path="/admin/login"
          element={
            <AuthProtection
              element={<AdminLoginPage />}
              redirectTo="/admin"
            />
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute element={<ProductPage />} role="user" />
          }
        />

        {/* Protected Admin Routes */}
        <Route path="/admin">
          <Route
            index
            element={
              <ProtectedRoute
                element={
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                }
                role="admin"
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                }
                role="admin"
              />
            }
          />
          <Route
            path="product/:slug"
            element={
              <ProtectedRoute
                element={
                  <AdminLayout>
                    <ProductDetails />
                  </AdminLayout>
                }
                role="admin"
              />
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute
                element={
                  <AdminLayout>
                    <AdminCategory />
                  </AdminLayout>
                }
                role="admin"
              />
            }
          />
        </Route>

        {/* Not FOund Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;