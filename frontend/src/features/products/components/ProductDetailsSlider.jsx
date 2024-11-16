import React, { useState } from "react";
import { ShoppingBag, X, Plus, Minus, Heart, ChevronDown } from "lucide-react";

const ProductDetailSlide = ({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleVariantChange = (variantType, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Details
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`h-5 w-5 ${
                    product.IsFavourite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="aspect-square rounded-xl overflow-hidden mb-6">
              <img
                src={product.ProductImage}
                alt={product.ProductName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {product.ProductName}
                </h3>
                <p className="text-lg font-medium text-indigo-600">
                  {parseFloat(product.Price).toFixed(2)}
                </p>
              </div>

              <p className="text-gray-600">{product.Description}</p>

              {/* Variants Selection */}
              <div className="space-y-4">
                {product.variants?.map((variant) => (
                  <div key={variant.type} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {variant.type}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedVariants[variant.type] || ""}
                        onChange={(e) =>
                          handleVariantChange(variant.type, e.target.value)
                        }
                        className="w-full py-2 pl-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-0 appearance-none"
                      >
                        <option value="">Select {variant.type}</option>
                        {variant.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Stock:</span>
                  <span className="font-medium text-gray-900">
                    {parseFloat(product.TotalStock).toFixed(2)} units
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.TotalStock, quantity + 1))
                    }
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-white">
            <button
              onClick={() => onAddToCart(product, quantity, selectedVariants)}
              disabled={
                Object.keys(product.variants || {}).length > 0 &&
                Object.keys(selectedVariants).length !==
                  Object.keys(product.variants).length
              }
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium 
                hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSlide;
