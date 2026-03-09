import React from "react";
import SkeletonCard from "./SkeletonCard";

const GridSkeletonLoader = ({ count = 8, columns = 4 }) => {
  const gridColumns = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${gridColumns[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default GridSkeletonLoader;
