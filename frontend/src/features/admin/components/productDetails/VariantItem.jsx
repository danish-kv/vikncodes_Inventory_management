import React from "react";
import { Package, Edit, Plus } from "lucide-react";

const VariantItem = ({
  variant,
  onAddSubVariant,
  onEditSubVariant,
  onEditVariant,
}) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm">
      <div className="border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Package size={20} />
          {variant.name}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => onAddSubVariant(variant.id, variant.name)}
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Sub Variant
          </button>
          <button
            onClick={() =>
              onEditVariant({
                variant_id: variant.id,
                variant_name: variant.name,
              })
            }
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
          >
            <Edit size={18} />
            Edit Variant
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variant Option
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {variant.subVariants.map((subVariant, idx) =>
              subVariant.sub_variant_name ? (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {subVariant.sub_variant_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subVariant.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subVariant.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onEditSubVariant(subVariant)}
                      className="text-gray-600 hover:text-gray-900 flex gap-2"
                    >
                      <Edit className="text-indigo-600" size={16} />
                    </button>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantItem;
