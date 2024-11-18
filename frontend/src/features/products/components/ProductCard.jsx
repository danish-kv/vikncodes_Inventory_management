import React from "react";
import { Heart } from "lucide-react";

const ProductCard = ({ product, onViewDetails, onFavorite }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(price));
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.ProductImage}
          alt={product.ProductName}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => {onViewDetails(product) }}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <span className="px-4 py-2 bg-white rounded-lg font-medium text-gray-900">
            View Details
          </span>
        </button>
        <button
          onClick={() => onFavorite(product.id)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-5 w-5 ${
              product.IsFavourite
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }`}
          />
        </button>
        <div className="absolute top-4 left-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              product.IsActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.IsActive ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 truncate">
            {product.ProductName}
          </h3>
          <span className="text-sm text-gray-500">{product.ProductCode}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-indigo-600">
            {formatPrice(product.Price)}
          </span>
          <span className="text-sm text-gray-500">
            {product.category_data.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
