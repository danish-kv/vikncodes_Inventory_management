import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Users, Grid } from 'lucide-react';

const CustomTooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && content && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Grid, label: "Categories", path: "/admin/categories" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-lg pt-16 transition-all duration-300 z-10
        ${isOpen ? 'w-64' : 'w-16'} 
        ${isOpen ? 'translate-x-0' : 'translate-x-0'}
        lg:translate-x-0`}
    >
      <nav className="mt-5 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          const linkContent = (
            <Link
              to={item.path}
              className={`group flex items-center px-2 py-3 text-sm font-medium rounded-lg
                ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}
                ${!isOpen ? 'justify-center' : ''}`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'text-indigo-500' : 'text-gray-400'
                } transition-colors duration-200`}
              />
              {isOpen && (
                <span className="ml-3 transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </Link>
          );

          return (
            <div key={item.path}>
              {!isOpen ? (
                <CustomTooltip content={item.label}>
                  {linkContent}
                </CustomTooltip>
              ) : (
                linkContent
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;