import React, { useState } from "react";
import { ShoppingBag, X, Plus, Minus, Heart, ChevronDown } from "lucide-react";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";

const ProductDetailSlide = ({ product, onClose, onPurchase, onFavorite }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleVariantChange = (variantId, subvariantId) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: subvariantId,
    }));
  };

  const handleQuantityChange = async (newQuantity) => {
    if (!areAllVariantsSelected()) {
      showToast(100, "Please select all variants before updating quantity.");
      return;
    }

    try {
      const res = await api.post("/api/check-quntity/", {
        product_id: product.id,
        selected_variants: selectedVariants,
        quantity: newQuantity,
      });
      console.log(res);

      const { available_stock } = res.data;

      if (newQuantity > available_stock) {
        showToast(100, `Only ${available_stock} units available.`);
        setQuantity(available_stock);
      } else {
        setQuantity(newQuantity);
      }
    } catch (error) {
      showToast(400, error.response?.data?.error || "Something went wrong");
    }
  };

  const areAllVariantsSelected = () => {
    return product.variants.length > 0
      ? Object.keys(selectedVariants).length === product.variants.length
      : true;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {product.ProductName}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onFavorite(product.id)}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="aspect-square rounded-xl overflow-hidden mb-6">
              <img
                src={product.ProductImage}
                alt={product.ProductName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              {/* Product Info */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {product.ProductName}
                </h3>
                <p className="text-lg font-medium text-indigo-600">
                  ₹{parseFloat(product.Price).toFixed(2)}
                </p>
              </div>

              <p className="text-gray-600">{product.Description}</p>

              {/* Variants Selection */}
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.subvariants.map((subvariant) => (
                        <button
                          key={subvariant.id}
                          onClick={() =>
                            handleVariantChange(variant.id, subvariant.id)
                          }
                          disabled={subvariant.stock === 0}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${
                              selectedVariants[variant.id] === subvariant.id
                                ? "bg-indigo-600 text-white"
                                : subvariant.stock === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            }
                          `}
                        >
                          {subvariant.option_name}
                          <span className="ml-2 text-xs">
                            {subvariant.stock === 0
                              ? "(Out of Stock)"
                              : `(${subvariant.stock})`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stock Info */}
              <div className="p-4 bg-indigo-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Stock:</span>
                  <span className="font-medium text-gray-900">
                    {parseFloat(product.TotalStock).toFixed(2)} units
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)} // Increase quantity by 1
                    className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="p-6 border-t bg-white">
            <button
              onClick={() => onPurchase(product, quantity, selectedVariants)}
              disabled={!areAllVariantsSelected()}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium 
                hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-5 w-5" />
              {areAllVariantsSelected()
                ? `Buy Now - ₹${(quantity * parseFloat(product.Price)).toFixed(
                    2
                  )}`
                : "Select all variants to continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSlide;
