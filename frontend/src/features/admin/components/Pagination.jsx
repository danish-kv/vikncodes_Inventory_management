import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    let items = [];
    const maxVisiblePage = 9;
    const halfVisible = Math.floor(maxVisiblePage / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePage - 1);

    // Adjust start and end pages to ensure we always show maxVisiblePage items
    if (endPage - startPage + 1 < maxVisiblePage) {
      startPage = Math.max(1, endPage - maxVisiblePage + 1);
    }

    // Add start ellipsis if needed
    if (startPage > 1) {
      items.push(
        <span
          key="start-ellipsis"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          ...
        </span>
      );
    }

    // Render page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
            currentPage === i
              ? "bg-red-50 text-red-600"
              : "bg-white text-gray-700"
          } hover:bg-gray-50`}
        >
          {i}
        </button>
      );
    }

    // Add end ellipsis if needed
    if (endPage < totalPages) {
      items.push(
        <span
          key="end-ellipsis"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >
          ...
        </span>
      );
    }

    return items;
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {currentPage !== 1 && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
            )}

            {renderPaginationItems()}

            {currentPage !== totalPages && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
