import React from "react";
import { MoreVertical, Eye, Lock, Unlock } from "lucide-react";
import Dropdown from "./Dropdown";

const ActionDropdown = ({ product, onView, onBlock }) => {
  return (
    <Dropdown
      trigger={
        <button className="text-gray-400 hover:text-gray-500">
          <MoreVertical className="h-5 w-5" />
        </button>
      }
    >
      <div className="py-1 ">
        <button
          onClick={() => onView(product.slug)}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </button>

        <button
          onClick={() => onBlock(product.slug, product.IsActive)}
          className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
        >
          {product.IsActive ? (
            <>
              <Lock className="h-4 w-4 mr-2 text-red-600" />
              <span className="text-red-600">Block</span>
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-green-600">Unblock</span>
            </>
          )}
        </button>
      </div>
    </Dropdown>
  );
};

export default ActionDropdown;
