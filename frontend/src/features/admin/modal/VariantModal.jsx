import React, { useState, useEffect } from "react";

const VariantModal = ({ isOpen, onClose, onSubmit, variant = null, productId }) => {
  const [variantName, setVariantName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (variant) {
      setVariantName(variant.variant_name || "");
    } else {
      setVariantName("");
    }
  }, [variant]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!variantName.trim()) {
      setError("Variant name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: variant?.variant_id || null,
        name: variantName.trim(),
        product: productId
      });

      setVariantName("");
      setError("");
      onClose();
    } catch (error) {
      setError(error.message || "Failed to save variant");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {variant ? "Edit" : "Add"} Variant
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Name
              </label>
              <input
                type="text"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter variant name"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? variant
                  ? "Saving..."
                  : "Adding..."
                : variant
                ? "Save Changes"
                : "Add Variant"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantModal;