/**
 * ============================================
 * PROFESSIONAL SIDEBAR
 * ============================================
 * - Role-based navigation links
 * - Lucide icons for every link
 * - Collapsible sidebar
 * - Active route highlighting
 * - Dark mode support
 */

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarCheck,
  FileText,
  Receipt,
  Pill,
  Package,
  Activity,
  MessageSquare,
  Stethoscope,
  Ambulance,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useState } from "react";

// Navigation items with role-based visibility
const navItems = [
  { path: "/", labelKey: "dashboard", icon: LayoutDashboard, roles: ["admin", "doctor", "receptionist"] },
  { path: "/patients", labelKey: "patients", icon: Users, roles: ["admin", "doctor", "receptionist"] },
  { path: "/doctors", labelKey: "doctors", icon: UserCog, roles: ["admin", "receptionist", "patient"] },
  { path: "/appointments", labelKey: "appointments", icon: CalendarCheck, roles: ["admin", "doctor", "receptionist", "patient"] },
  { path: "/prescriptions", labelKey: "prescriptions", icon: Pill, roles: ["admin", "doctor", "patient"] },
  { path: "/emr", labelKey: "Medical Records", icon: FileText, roles: ["admin", "doctor"] },
  { path: "/billing", labelKey: "billing", icon: Receipt, roles: ["admin", "receptionist"] },
  { path: "/inventory", labelKey: "inventory", icon: Package, roles: ["admin"] },
  { path: "/symptom-checker", labelKey: "Symptom Checker", icon: Stethoscope, roles: ["admin", "doctor", "receptionist", "patient"] },
  { path: "/queue", labelKey: "Queue", icon: Activity, roles: ["admin", "doctor", "receptionist"] },
  { path: "/chat", labelKey: "Chat", icon: MessageSquare, roles: ["admin", "doctor", "patient"] },
  { path: "/ambulance", labelKey: "Ambulance", icon: Ambulance, roles: ["admin", "receptionist"] },
  { path: "/activity-logs", labelKey: "Activity Logs", icon: Activity, roles: ["admin"] },
];

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  // Filter nav items by user's role
  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out sticky top-0`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">
              MedCare
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Hospital System
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
              }`
            }
          >
            <item.icon
              className={`w-5 h-5 flex-shrink-0 ${
                collapsed ? "mx-auto" : ""
              }`}
            />
            {!collapsed && <span className="truncate">{t(item.labelKey, item.labelKey)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
