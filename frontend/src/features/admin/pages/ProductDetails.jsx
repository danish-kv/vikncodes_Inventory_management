import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useVariants from "../hooks/useVariant";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import SubVariantModal from "../modal/SubVariantModal";
import useProductDetails from "../../products/hooks/useProductDetails";
import EditProductDrawer from "../components/productDetails/EditProductDrawer";
import VariantModal from "../modal/VariantModal";
import ProductDetailsImage from "../components/productDetails/ProductDetailsImage";
import ProductDetailsInfo from "../components/productDetails/ProductDetailsInfo";
import ProductDetailsHeader from "../components/productDetails/ProductDetailsHeader";
import VariantsList from "../components/productDetails/VariantsList";

const ProductDetails = () => {
  const { slug } = useParams();
  const { variants, loading, getVariants } = useVariants(slug);
  const { products, getProducts } = useProductDetails(slug);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [subVariantToEdit, setSubVariantToEdit] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState(null);
  console.log(variants);


  const handleAddSubVariant = (id, name) => {
    setSelectedVariant({ id, name });
    setIsModalOpen(true);
  };

  const handleEditSubVariant = (subVariant) => {
    setSelectedVariant({
      id: subVariant.variant_id,
      name: subVariant.variant_name,
    });
    setSubVariantToEdit(subVariant);
    setIsModalOpen(true);
  };

  const handleSubmitSubVariant = async (data) => {
    try {
      console.log("add sub variant ==", data);

      if (data.id) {
        const res = await api.patch(`/api/sub-variant/${data.id}/`, {
          option_name: data.name,
          stock_quantity: data.stock,
        });
        console.log(res);

        showToast(200, "Sub Variant updated successfully");
      } else {
        const res = await api.post("/api/sub-variant/", {
          variant: selectedVariant.id,
          option_name: data.name,
          stock_quantity: data.stock,
        });
        console.log(res);

        showToast(200, "Added Sub Variant");
      }

      await getVariants();
    } catch (error) {
      const Error = error?.response?.data?.non_field_errors
        ? "Sub Variant Already exists for this Variant"
        : "Failed to adding sub variant";
      showToast(400, Error);
      console.error(error);
    } finally {
      setSubVariantToEdit(null);
    }
  };

  const handleEditProduct = async (data) => {
    console.log(data);

    try {
      const res = await api.patch(`/api/product/${products.slug}/`, data);
      console.log(res);
      showToast(200, "Product Updated Successfully...");
      getProducts();
    } catch (error) {
      console.log(error);
      showToast(400, "Failed to udpated products, Please try again");
    }
  };

  const handleSubmitVariant = async (data) => {
    try {
      if (data.id) {
        const res = await api.patch(`/api/variant/${data.id}/`, {
          name: data.name,
        });
        console.log(res);

        showToast(200, "Variant updated successfully");
      } else {
        const res = await api.post("/api/variant/", {
          name: data.name,
          product: data.product,
        });
        console.log(res);

        showToast(200, "Added Variant");
      }
      await getVariants();
    } catch (error) {
      const errorMessage = error?.response?.data?.non_field_errors
        ? "Variant already exists for this product"
        : "Failed to save variant";
      showToast(400, errorMessage);
      console.error(error);
    } finally {
      setVariantToEdit(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <ProductDetailsHeader
          product={products}
          onEditClick={() => {
            setSelectedProduct(products);
            setIsEditDrawerOpen(true);
          }}
          onAddVariantClick={() => setIsVariantModalOpen(true)}
        />

        <ProductDetailsInfo product={products} />
      </div>

      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <ProductDetailsImage product={products} />
      </div>

      {/* Variants Section */}
      <VariantsList
        loading={loading}
        variants={variants?.variants}
        onAddSubVariant={handleAddSubVariant}
        onEditSubVariant={handleEditSubVariant}
        onEditVariant={(variant) => {
          setVariantToEdit(variant);
          setIsVariantModalOpen(true);
        }}
      />

      <SubVariantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubVariantToEdit(null);
        }}
        variantName={selectedVariant?.name}
        subVariant={subVariantToEdit}
        onSubmit={handleSubmitSubVariant}
      />

      <SubVariantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubVariantToEdit(null);
        }}
        variantName={selectedVariant?.name}
        subVariant={subVariantToEdit}
        onSubmit={handleSubmitSubVariant}
      />

      <VariantModal
        isOpen={isVariantModalOpen}
        onClose={() => {
          setIsVariantModalOpen(false);
          setVariantToEdit(null);
        }}
        variant={variantToEdit}
        productId={products?.id}
        onSubmit={handleSubmitVariant}
      />

      <EditProductDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSubmit={handleEditProduct}
        productData={selectedProduct}
      />
    </div>
  );
};

export default ProductDetails;
