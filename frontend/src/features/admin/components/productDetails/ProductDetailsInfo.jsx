import { Box, Hash, IndianRupee, Tag } from "lucide-react";
import InfoCard from "./InfoCard";

const ProductDetailsInfo = ({ product }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard
          icon={<Tag className="w-10 h-10 text-blue-600" />}
          label="Product Code"
          value={product?.ProductCode}
        />
        <InfoCard
          icon={<Hash className="w-10 h-10 text-green-600" />}
          label="HSN Code"
          value={product?.HSNCode}
        />
        <InfoCard
          icon={<Box className="w-10 h-10 text-purple-600" />}
          label="Total Stock"
          value={parseFloat(product?.TotalStock).toFixed(2)}
        />
        <InfoCard
          icon={<IndianRupee className="w-10 h-10 text-orange-600" />}
          label="Price"
          value={`₹ ${parseFloat(product?.Price).toFixed(2)}`}
        />
      </div>
    );
  };

  
  export default ProductDetailsInfo