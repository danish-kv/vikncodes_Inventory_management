import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ProductCategory = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const scrollCategories = (direction) => {
    const container = document.getElementById("categories-container");
    const scrollAmount = direction === "left" ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative mb-8">
      <button
        onClick={() => scrollCategories("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg text-gray-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div
        id="categories-container"
        className="flex gap-4 overflow-x-auto hide-scrollbar relative px-8"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          key="all"
          className={`flex-shrink-0 px-6 py-3 bg-white rounded-xl border-2 
            ${
              selectedCategory === null
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-600"
            } 
            cursor-pointer transition-all transform hover:-translate-y-1`}
          onClick={() => onSelectCategory(null)}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">All</span>
          </div>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex-shrink-0 px-6 py-3 bg-white rounded-xl border-2 
              ${
                selectedCategory === category.slug
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-600"
              } 
              cursor-pointer transition-all transform hover:-translate-y-1`}
            onClick={() => onSelectCategory(category.slug)}
          >
            <div className="flex items-center ">
              <span className="font-medium text-gray-700">{category.name}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollCategories("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg text-gray-600 hover:text-indigo-600"
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductCategory;
