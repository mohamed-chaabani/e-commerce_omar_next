import React from "react";

const SliderSkeleton = () => {
  return (
    <div className="container py-5">
      <div className="w-full h-[560px] md:h-[500px] animate-pulse bg-gray-300 dark:bg-secondary-800 rounded-lg"></div>
    </div>
  );
};

export default SliderSkeleton;
