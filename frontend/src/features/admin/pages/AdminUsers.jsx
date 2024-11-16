import React, { useState } from "react";
import { Search, User } from "lucide-react";
import api from "../../../services/api";
import useUsers from "../hooks/useUsers";
import { dateFormat } from "../../../utils/dateformat";

const AdminUsers = () => {
  const { users, getUsers, loading } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  console.log(users);

  const handleBlock = async (id, current_status) => {
    try {
      const res = await api.patch(`/api/register/${id}/`, {
        is_active: !current_status,
      });
      console.log(res);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          User Management
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Manage system users and their permissions
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Verified
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Last Login
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.profile ? (
                        <img
                          src={user.profile}
                          alt={user.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-8 h-8 rounded-full border" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          user.is_verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-black"
                        }`}
                    >
                      {user.is_verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.last_login ? dateFormat(user.last_login) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleBlock(user.id, user.is_active)}
                        className={`text-sm font-medium px-4 py-2 rounded-md transition-colors focus:outline-none border
                         
                         ${
                           user.is_active
                             ? "text-green-600 hover:text-green-800 hover:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                             : "text-red-600 hover:text-red-800 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 "
                         }`}
                      >
                        {user.is_active ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
