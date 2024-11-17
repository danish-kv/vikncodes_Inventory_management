import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import useProducts from "../../products/hooks/useProducts";
import AddProductDrawer from "../components/AddProductDrawer";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import StatsGrid from "../components/StatusGrid";
import ProductsFilterBar from "../components/ProductsFilterBar";
import Pagination from "../components/Pagination";
import { ProductsTable } from "../components/ProductsTable";
import useDashboard from "../hooks/useDashboard";

export const AdminProducts = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const { products, getProducts } = useProducts();
  const { dashboard } = useDashboard();
  console.log(dashboard);

  console.log(searchTerm);

  useEffect(() => {
    const delay = setTimeout(() => {
      getProducts(searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <div className="mb-8">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">
                Manage your product inventory
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>

          <StatsGrid data={dashboard} />

          <ProductsFilterBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <ProductsTable
            products={products}
            onView={(slug) => navigate(`/admin/product/${slug}`)}
            onBlock={handleBlock}
          />

          <Pagination
            products={products}
            itemsPerPage={5}
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
