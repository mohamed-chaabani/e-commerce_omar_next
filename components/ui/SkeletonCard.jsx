import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="animate-pulse flex flex-col">
        <div className="bg-gray-300 dark:bg-gray-700 h-48 w-full"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
