import React from "react";
import { Package, Edit, Plus } from "lucide-react";
import VariantItem from "./VariantItem";

const VariantsList = ({
  loading,
  variants,
  onAddSubVariant,
  onEditSubVariant,
  onEditVariant,
}) => {
  const groupVariantsByName = (variants) => {
    return variants?.reduce((acc, variant) => {
      const key = variant.variant_name;
      if (!acc[key]) {
        acc[key] = {
          id: variant.variant_id,
          name: variant.variant_name,
          subVariants: [],
        };
      }
      acc[key].subVariants.push(variant);
      return acc;
    }, {});
  };

  const groupedVariants = groupVariantsByName(variants);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return Object.entries(groupedVariants || {}).map(([variantKey, variantData]) => (
    <VariantItem
      key={variantData.id}
      variant={variantData}
      onAddSubVariant={onAddSubVariant}
      onEditSubVariant={onEditSubVariant}
      onEditVariant={onEditVariant}
    />
  ));
};

export default VariantsList;
