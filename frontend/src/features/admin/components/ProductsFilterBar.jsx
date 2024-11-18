import React from "react";
import { Filter, Search } from "lucide-react";

const ProductsFilterBar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option onClick={() => setSelectedCategory(null)} disabled value="">
            All Categories
          </option>
          {categories &&
            categories.map((cat) => {
              return (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              );
            })}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-Price">Price: High to Low</option>
          <option value="Price">Price: Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default ProductsFilterBar;
