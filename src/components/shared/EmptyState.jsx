/**
 * ============================================
 * EMPTY STATE COMPONENT
 * ============================================
 * Friendly message when a list has no data
 */

import { FileX, Search, Calendar, Users } from "lucide-react";

const icons = {
  default: FileX,
  search: Search,
  appointments: Calendar,
  patients: Users,
};

const EmptyState = ({
  icon = "default",
  title = "No data found",
  description = "There's nothing to show here yet.",
  action,
  actionLabel,
}) => {
  const IconComponent = icons[icon] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <IconComponent className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {actionLabel || "Add New"}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
