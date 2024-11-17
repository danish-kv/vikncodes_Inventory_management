import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, ShieldIcon, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { LoginThunk } from "../../../redux/thunk/authThunk";
import { showToast } from "../../../utils/showToast";
import { toggleOtpAccess } from "../../../redux/slices/authSlice";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLoginPage = () => {
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
   

      if (res.payload.status === 404) {
        const Error = res.payload.response.data;
        if (Error) {
          showToast(400, Error);
          return;
        }
      }

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/admin");
      }
    } catch (error) {
      console.log("catch error ===", error);
      showToast(400, "Invalid administrator credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600  rounded-xl flex items-center justify-center mb-6">
            <ShieldIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Administrator Access
          </h2>
          <p className="text-gray-500">Secure admin portal login</p>
        </div>

  

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Admin Email
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
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Admin Password
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
                placeholder="Enter admin password"
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

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
            text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600  hover:from-indigo-700 
            hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
            transition-all duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Access Admin Panel"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-500">
            This is a restricted access point. Unauthorized access attempts will be logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;