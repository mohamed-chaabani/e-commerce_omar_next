import React from "react";

const ProductDetailSkeletonLoader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        {/* Image Skeleton */}
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-[500px] w-full"></div>

        {/* Details Skeleton */}
        <div className="flex flex-col pt-8 space-y-6">
          {/* Category/Brand */}
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          {/* Product Name */}
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          {/* Price */}
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          {/* Description */}
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          </div>
          {/* Product Details Section */}
          <div className="pt-8 space-y-5">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeletonLoader;
