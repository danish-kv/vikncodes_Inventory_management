import React from "react";
import { Link } from "react-router-dom";
import { FolderX, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <FolderX className="w-12 h-12 text-gray-400 mx-auto mb-6" />

          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Page not found
          </h1>

          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div>
          <Link
            to="/"
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
