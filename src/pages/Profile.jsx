/**
 * ============================================
 * PROFILE PAGE
 * ============================================
 * User settings, password change, and profile info
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { User, Mail, Phone, Lock, Save, Loader2, Camera } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If changing password, it needs to hit a specific endpoint or be handled by the backend
      // Here we just update profile info for demo
      const { data } = await api.put("/auth/profile", {
        name: form.name,
        phone: form.phone,
        ...(form.newPassword && {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });
      updateUser(data.data);
      toast.success("Profile updated successfully!");
      setForm({ ...form, currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <button className="absolute bottom-1 right-1 p-1.5 bg-gray-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              {user?.role}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.email} disabled className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={form.currentPassword} onChange={(e) => setForm({...form, currentPassword: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={form.newPassword} onChange={(e) => setForm({...form, newPassword: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
