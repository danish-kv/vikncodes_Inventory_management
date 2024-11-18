import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import Header from "../../../common/Header";
import ProductCard from "../components/ProductCard";
import ProductDetailSlide from "../components/ProductDetailsSlider";
import ProductCategory from "../components/ProductCategory";
import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategory";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import Pagination from "../../admin/components/Pagination";

const ProductPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const { products, getProducts, page, setPage, totalPages } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    const delay = setTimeout(() => {
      getProducts(searchTerm, selectedCategory, sortBy, page);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory, sortBy, page]);

  const handlePurchase = async (product, quantity, variants) => {
    try {
      const selectedStockId = Object.values(variants)[0];
      if (!selectedStockId) {
        showToast(100, "Please select a valid stock variant.");
        return;
      }
      const data = {
        stock_id: selectedStockId,
        quantity: quantity,
      };

      const res = await api.post("/api/purchase/", data);
      if (res.status === 201) {
        showToast(200, "Purchase successful!");
      }
    } catch (error) {
      console.error(
        "Purchase failed:",
        error.response?.data?.error || error.message
      );
      showToast(
        400,
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  const handleCloseDetailSlide = () => {
    setIsDetailOpen(false);
  };

  const handleFavorite = () => {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-0 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-indigo-600 transition-colors">
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Categories */}
        <ProductCategory
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={() => {
                setSelectedProduct(product);
                setIsDetailOpen(true);
              }}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      </main>

      {products && products.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {isDetailOpen && selectedProduct && (
        <ProductDetailSlide
          product={selectedProduct}
          onClose={handleCloseDetailSlide}
          onPurchase={(product, quantity, variants) =>
            handlePurchase(product, quantity, variants)
          }
          onFavorite={handleFavorite}
        />
      )}
    </div>
  );
};

export default ProductPage;
