import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { SignupThunk } from "../../../redux/thunk/authThunk";
import { showToast } from "../../../utils/showToast";
import { RegisterSchema } from "../../../validations/YupSchemas";
import { toggleOtpAccess } from "../../../redux/slices/authSlice";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await dispatch(SignupThunk(values));
      console.log(res);
      
      if (res.payload.status === 400) {
        const errorEmail = res.payload.response.data.email?.[0];
        const errorUsername = res.payload.response.data.username?.[0];

        if (errorEmail) {
          setFieldError("email", errorEmail);
          showToast(400, errorEmail);
        } else if (errorUsername) {
          setFieldError("username", errorUsername);
          showToast(400, errorUsername);
        }
        return;
      }
      dispatch(toggleOtpAccess(true));

      navigate("/otp", {state : {email : values.email}});
    } catch (error) {
      console.error("Registration error:", error);
      setFieldError("general", "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
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
            Welcome to Invenio
          </h2>
          <p className="text-gray-500">
            Smart inventory management starts here
          </p>
        </div>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Staff Username
                </label>
                <div className="mt-1">
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-lg shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${
                      errors.username && touched.username
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your username"
                  />
                  {errors.username && touched.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-lg shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="name@gmail.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
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
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`appearance-none block w-full px-3 py-2.5 border rounded-lg shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Create a secure password"
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
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm 
                text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Join Invenio"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in to Invenio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
