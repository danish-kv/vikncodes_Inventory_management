import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddProductDrawer = ({ isOpen, onClose, onSubmit, IsLoading }) => {
  const [productData, setProductData] = useState({
    ProductCode: "",
    ProductID: "",
    ProductName: "",
    ProductImage: null,
    Description: "",
    Category: 1,
    Price: "",
    HSNCode: "",
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({ ...productData, ProductImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-xl overflow-y-auto"
          >
            <div className="p-6 z-">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productData.ProductName}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          ProductName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Code
                    </label>
                    <input
                      type="text"
                      value={productData.ProductCode}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          ProductCode: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Category and Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={productData.Category}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          Category: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Category</option>
                      <option value="1">Electronics</option>
                      <option value="2">Clothing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      value={productData.Price}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          Price: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Stock and HSN */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product ID
                    </label>
                    <input
                      type="text"
                      value={productData.ProductID}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          ProductID: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      value={productData.HSNCode}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          HSNCode: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={productData.Description}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        Description: e.target.value,
                      })
                    }
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
               disabled={IsLoading}   >
                    {IsLoading ? 'Loading' :"Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddProductDrawer;
