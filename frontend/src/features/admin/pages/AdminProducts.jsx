import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import useProducts from "../../products/hooks/useProducts";
import AddProductDrawer from "../components/AddProductDrawer";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import StatsGrid from "../components/StatusGrid";
import ProductsFilterBar from "../components/ProductsFilterBar";
import Pagination from "../components/Pagination";
import { ProductsTable } from "../components/ProductsTable";

export const AdminProducts = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const { products, loading, getProducts } = useProducts();

  const handleAddProduct = async (product) => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/product/", product);
      console.log("res == ", res);
      if (res.status === 201) {
        getProducts();
        setIsDrawerOpen(false);
        showToast(200, "New Product added successfully...");
      }
    } catch (error) {
      console.log(error);
      showToast(400, "Failed to add a new Product...");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (id, current_status) => {
    try {
      const res = await api.patch(`/api/product/${id}/`, {
        IsActive: !current_status,
      });
      console.log(res);
      getProducts();
      showToast(200, "Status changed...");
    } catch (error) {
      console.log(error);
      showToast(200, "Failed to change status!");
    }
  };

  const handleOpenEditDrawer = (product) => {
    console.log(product);

    setEditProduct(product.slug);
    setIsEditDrawerOpen(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="">
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">
                Manage your product inventory
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
          
          <StatsGrid />

          <ProductsFilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <ProductsTable
            products={products}
            onView={(id) => navigate(`/admin/products/${id}`)}
            onBlock={handleBlock}
          />

          <Pagination
            currentPage={1}
            totalPages={10}
            onPageChange={(page) => console.log("Page changed to:", page)}
          />

          <AddProductDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onSubmit={handleAddProduct}
            IsLoading={IsLoading}
          />

        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
