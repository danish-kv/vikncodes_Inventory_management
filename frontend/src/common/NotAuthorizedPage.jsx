import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotAuthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have the necessary permissions to access this page.
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            to="/" 
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
          
          <Link 
            to="/login" 
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Sign in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;