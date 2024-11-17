import React from 'react';
import { Edit, Plus } from "lucide-react";

const ProductDetailsHeader = ({ product, onEditClick, onAddVariantClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {product?.ProductName}
          </h1>
          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm">
            {product?.category_data?.name}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{product?.Description}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 border"
        >
          <Edit size={18} />
          Edit Product
        </button>
        <button
          onClick={onAddVariantClick}
          className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Variant
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsHeader