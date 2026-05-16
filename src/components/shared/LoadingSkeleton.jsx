/**
 * ============================================
 * LOADING SKELETON COMPONENT
 * ============================================
 * Shows shimmer effect while data is loading.
 * Much better UX than a spinning wheel.
 */

const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skeletons.map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
        {skeletons.map((i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        {skeletons.map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
