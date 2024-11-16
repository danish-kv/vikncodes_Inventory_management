import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { LoginThunk } from "../../../redux/thunk/authThunk";
import { showToast } from "../../../utils/showToast";
import { toggleOtpAccess } from "../../../redux/slices/authSlice";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await dispatch(LoginThunk(formData));
      console.log(res);

      const isNotVerified =
        res.payload?.response?.data?.require_verification?.[0] === "True";

      if (isNotVerified) {
        dispatch(toggleOtpAccess(true));
        navigate("/otp", { state: { email: formData.email } });
        return;
      }

      if (res.payload.status === 404) {
        const Error = res.payload.response.data;
        if (Error) {
          showToast(400, Error);
          return;
        }
      }

      if (res.meta.requestStatus == "fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.log("catch error ===", error);
      showToast(400, "Failed to Login!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-lg p-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">IN</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500">Sign in to manage your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
            text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
            hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
            transition-all duration-200"
            disabled={loading}
          >
            Sign in to Invenio
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to Invenio?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/register"
              className="w-full flex justify-center py-3 px-4 border border-indigo-600 rounded-lg shadow-sm 
              text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              transition-all duration-200"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
