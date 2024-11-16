import { Heart } from 'lucide-react'
import React from 'react'

const ProductCard = ({product, onViewDetails, onToggleFavorite}) => {
  console.log(product.ProductImage);
  
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <div className="relative aspect-square bg-gray-100">
      <img
        src={product.ProductImage}
        alt={product.ProductName}
        className="w-full h-full object-cover"
      />
      <button
        onClick={() => onViewDetails(product)}
        className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
      >
        <span className="px-4 py-2 bg-white rounded-lg font-medium text-gray-900">
          View Details
        </span>
      </button>
      <button
        onClick={() => onToggleFavorite(product.id)}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          className={`h-5 w-5 ${
            product.IsFavourite ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      </button>
    </div>
    <div className="p-4">
      <h3 className="font-medium text-gray-900">{product.ProductName}</h3>
      <p className="text-gray-500">{product.price}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {product.variants?.map((variant) => (
          <span
            key={variant.id}
            className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
          >
            {variant.name}
          </span>
        ))}
      </div>
    </div>
  </div>
  )
}

export default ProductCard
