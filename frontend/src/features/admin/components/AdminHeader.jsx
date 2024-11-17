import React, { useState } from "react";
import { Package, ChevronDown, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { LogoutThunk } from "../../../redux/thunk/authThunk";

const AdminHeader = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full z-20">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center ml-4">
              <Package className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                Invenio
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2"
              >
                <div className="h-7 w-7 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">A</span>
                </div>
                <div className="hidden sm:block text-sm text-left">
                  <div className="font-medium text-gray-700">Admin</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  
                  <div className="py-1" onClick={() => dispatch(LogoutThunk())}>
                    <p className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100">
                      Sign out
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
