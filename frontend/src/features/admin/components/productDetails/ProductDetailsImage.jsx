import { dateFormat } from "../../../../utils/dateformat";

const ProductDetailsImage = ({ product }) => {
    return (
      <div className="flex items-start gap-6">
        <img
          src={product?.ProductImage}
          alt={product?.ProductName}
          className="w-32 h-32 rounded-lg object-cover border"
        />
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Created Date</p>
            <p className="font-medium">{dateFormat(product?.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{dateFormat(product?.updated_at)}</p>
          </div>
        </div>
      </div>
    );
  };
  
export default ProductDetailsImage