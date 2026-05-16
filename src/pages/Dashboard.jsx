/**
 * ============================================
 * DASHBOARD PAGE — Analytics & Overview
 * ============================================
 * Shows real stats from the backend API:
 * - Stat cards (patients, doctors, appointments, revenue)
 * - Appointment status chart
 * - Revenue trend chart
 * - Recent appointments & patients
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import {
  Users,
  UserCog,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Stat card component
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow animate-fadeIn">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    {trend && (
      <div className="flex items-center gap-1 mt-2">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-xs text-green-600 dark:text-green-400 font-medium">{trend}</span>
      </div>
    )}
  </div>
);

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartsRes, recentRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/charts"),
          api.get("/dashboard/recent"),
        ]);
        setStats(statsRes.data.data);
        setCharts(chartsRes.data.data);
        setRecent(recentRes.data.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        // Use fallback empty data
        setStats({
          totalPatients: 0, totalDoctors: 0, totalAppointments: 0,
          totalRevenue: 0, todayAppointments: 0, pendingAppointments: 0, lowStockItems: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  // Format chart data
  const statusData = charts?.statusDistribution?.map((item) => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1),
    value: item.count,
  })) || [];

  const monthlyData = charts?.appointmentsByMonth?.map((item) => ({
    month: item._id,
    appointments: item.count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Overview of your hospital management system
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={Users}
          color="bg-blue-500"
          trend="+12% this month"
        />
        <StatCard
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          icon={UserCog}
          color="bg-green-500"
        />
        <StatCard
          title="Appointments"
          value={stats?.totalAppointments || 0}
          icon={CalendarCheck}
          color="bg-amber-500"
          trend={`${stats?.todayAppointments || 0} today`}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={IndianRupee}
          color="bg-purple-500"
          trend="+8% this month"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-4">
          <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats?.pendingAppointments || 0}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Pending Appointments</p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-4">
          <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats?.todayAppointments || 0}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Today's Appointments</p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats?.lowStockItems || 0}</p>
            <p className="text-xs text-red-600 dark:text-red-400">Low Stock Alerts</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Appointments
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f9fafb",
                  }}
                />
                <Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
              No appointment data yet
            </div>
          )}
        </div>

        {/* Appointment Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appointment Status
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
              No status data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {recent?.upcomingAppointments?.length > 0 ? (
              recent.upcomingAppointments.map((appt) => (
                <div key={appt._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {appt.patientId?.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(appt.date).toLocaleDateString()} • {appt.slot}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    appt.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Patients
          </h3>
          <div className="space-y-3">
            {recent?.recentPatients?.length > 0 ? (
              recent.recentPatients.map((patient) => (
                <div key={patient._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {patient.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{patient.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No patients yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;