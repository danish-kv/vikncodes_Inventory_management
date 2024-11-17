import React, { useState } from "react";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import useCategory from "../hooks/useCategory";
import { dateFormat } from "../../../utils/dateformat";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";

const AdminCategory = () => {
  const { categories, loading, getCategories } = useCategory();
  console.log(categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        status: category.is_active ? "active" : "inactive",
      });
    } else {
      setFormData({ name: "", status: "active" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast(400, "Category name should not be blank");
      return;
    }
    if (modalMode === "create") {
      try {
        const res = await api.post("/api/category/", formData);
        console.log(res);
        getCategories();
      } catch (error) {
        console.log(error);
        const NameError = error?.response?.data?.name[0];
        showToast(400, NameError || "Failed to create category!");
      }
    } else {
      try {
        const res = await api.patch(
          `/api/category/${selectedCategory.slug}/`,
          formData
        );
        console.log(res);
        getCategories();
      } catch (error) {
        console.log(error);
        const NameError = error?.response?.data?.name[0];
        showToast(400, NameError || "Failed to create category!");
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Category Management
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage your product categories</p>
          <button
            onClick={() => handleOpenModal("create")}
            className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Last updated
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {category.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        category.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {dateFormat(category.updated_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleOpenModal("edit", category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalMode === "create" ? "Create Category" : "Edit Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.is_active ? "true" : "false"} // Convert boolean to string
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-lg"
                >
                  {modalMode === "create" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
