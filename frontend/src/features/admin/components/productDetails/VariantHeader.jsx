const VariantHeader = ({ name, onAddSubVariant, onEditVariant }) => (
    <div className="border-b px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Package size={20} />
        {name}
      </h2>
      <div className="flex gap-3">
        <button
          onClick={onAddSubVariant}
          className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Sub Variant
        </button>
        <button
          onClick={onEditVariant}
          className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
        >
          <Edit size={18} />
          Edit Variant
        </button>
      </div>
    </div>
  );

  export default VariantHeader