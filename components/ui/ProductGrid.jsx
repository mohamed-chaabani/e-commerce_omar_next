import React from "react";
import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ promo, nouveau, products, columns = 4 }) => {
  const flexWidths = {
    2: "w-full sm:w-1/2",
    3: "w-full sm:w-1/2 lg:w-1/3",
    4: "w-full sm:w-1/2 lg:w-1/3 xl:w-1/4",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-8 ">
      {products?.map((product) => (
        <div key={product._id || product.id} className="px-3 mb-6">
          <ProductCard promo={promo} nouveau={nouveau} product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
