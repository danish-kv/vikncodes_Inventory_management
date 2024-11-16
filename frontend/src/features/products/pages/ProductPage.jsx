import React, { useState } from "react";
import { Search, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "../../../common/Header";
import ProductCard from "../components/ProductCard";
import ProductDetailSlide from "../components/ProductDetailsSlider";
import ProductCategory from "../components/ProductCategory";
import useProducts from "../hooks/useProducts";

const ProductPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Furniture" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Books" },
    { id: 5, name: "Sports" },
    { id: 6, name: "Kitchen" },
    { id: 7, name: "Beauty" },
    { id: 8, name: "Toys" },
  ]);

  const {products, loading, getProducts} = useProducts()
  console.log('prodcuts ===== ', products);
  

  const handleToggleFavorite = async (productId) => {
    try {
      // Make API call to toggle favorite status
      // const response = await fetch(`/api/products/${productId}/favorite`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // If API call is successful, update local state
      const updatedProducts = products.map((product) =>
        product.id === productId
          ? { ...product, IsFavourite: !product.IsFavourite }
          : product
      );

      // Update your products state here
      // setProducts(updatedProducts);

      // If product detail is open, update that too
      if (selectedProduct?.id === productId) {
        setSelectedProduct((prevProduct) => ({
          ...prevProduct,
          IsFavourite: !prevProduct.IsFavourite,
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleAddToCart = (product, quantity, selectedVariants) => {
    // Implement your cart logic here
    console.log("Adding to cart:", { product, quantity, selectedVariants });
  };

  const scrollCategories = (direction) => {
    const container = document.getElementById("categories-container");
    const scrollAmount = direction === "left" ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // const filteredProducts = products.filter(
  //   (product) =>
  //     product.ProductName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     product.ProductCode.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-0 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onViewDetails={setSelectedProduct}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </main>

      {/* Product Detail Slide Panel */}
      {selectedProduct && (
        <ProductDetailSlide
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default ProductPage;
