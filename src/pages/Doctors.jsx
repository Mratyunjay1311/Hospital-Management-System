/**
 * ============================================
 * DOCTORS PAGE — List + CRUD + Availability
 * ============================================
 */

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import toast from "react-hot-toast";
import {
  Plus, Search, Edit2, Trash2, X, Loader2, Star,
  ChevronLeft, ChevronRight, IndianRupee, Clock,
} from "lucide-react";

const SPECIALIZATIONS = [
  "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic", "Pediatrician", "Gynecologist", "ENT Specialist",
  "Ophthalmologist", "Psychiatrist", "Dentist", "Surgeon", "Urologist", "Other",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

const Doctors = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "doctor123", phone: "", gender: "",
    specialization: "", consultationFee: "", experience: "", qualification: "", bio: "",
    availability: [],
  });

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/doctors", {
        params: { search, specialization: specFilter || undefined, page, limit: 10 },
      });
      setDoctors(data.data.doctors);
      setPagination(data.data.pagination);
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, [search, specFilter, page]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const resetForm = () => {
    setForm({
      name: "", email: "", password: "doctor123", phone: "", gender: "",
      specialization: "", consultationFee: "", experience: "", qualification: "",
      bio: "", availability: []
    });
    setEditingDoctor(null);
    setShowForm(false);
  };

  const handleEdit = (doc) => {
    setEditingDoctor(doc);
    setForm({
      name: doc.userId?.name || "",
      email: doc.userId?.email || "",
      password: "",
      phone: doc.userId?.phone || "",
      gender: doc.userId?.gender || "",
      specialization: doc.specialization || "",
      consultationFee: doc.consultationFee || "",
      experience: doc.experience || "",
      qualification: doc.qualification || "",
      bio: doc.bio || "",
      availability: doc.availability || [],
    });
    setShowForm(true);
  };

  const toggleSlot = (dayName, slot) => {
    setForm((prev) => {
      const avail = [...prev.availability];
      const dayIdx = avail.findIndex((a) => a.day === dayName);
      if (dayIdx === -1) {
        avail.push({ day: dayName, slots: [slot] });
      } else {
        const slots = avail[dayIdx].slots.includes(slot)
          ? avail[dayIdx].slots.filter((s) => s !== slot)
          : [...avail[dayIdx].slots, slot];
        if (slots.length === 0) avail.splice(dayIdx, 1);
        else avail[dayIdx] = { ...avail[dayIdx], slots };
      }
      return { ...prev, availability: avail };
    });
  };

  const isDaySlotSelected = (day, slot) =>
    form.availability.find((a) => a.day === day)?.slots.includes(slot) || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor._id}`, form);
        toast.success("Doctor updated!");
      } else {
        await api.post("/doctors", form);
        toast.success("Doctor created!");
      }
      resetForm();
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete doctor "${name}"?`)) return;
    try {
      await api.delete(`/doctors/${id}`);
      toast.success("Doctor deleted");
      fetchDoctors();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctors</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage medical staff • {pagination.total || 0} total
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={specFilter}
          onChange={(e) => { setSpecFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={!!editingDoctor}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization *</label>
                  <select
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee (₹) *</label>
                  <input
                    type="number"
                    value={form.consultationFee}
                    onChange={(e) => setForm({ ...form, consultationFee: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience (yrs)</label>
                  <input
                    type="number"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qualification</label>
                <input
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  placeholder="MD, MBBS..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weekly Availability</label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                          <th className="px-2 py-2 text-left font-medium text-gray-500 w-24">Day</th>
                          {TIME_SLOTS.map((t) => <th key={t} className="px-1 py-2 text-center font-medium text-gray-500">{t}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {DAYS.map((day) => (
                          <tr key={day} className="border-t border-gray-100 dark:border-gray-700">
                            <td className="px-2 py-1.5 font-medium text-gray-700 dark:text-gray-300">{day.slice(0, 3)}</td>
                            {TIME_SLOTS.map((slot) => (
                              <td key={slot} className="px-1 py-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => toggleSlot(day, slot)}
                                  className={`w-6 h-6 rounded transition-colors ${
                                    isDaySlotSelected(day, slot)
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                  }`}
                                >
                                  {isDaySlotSelected(day, slot) ? "✓" : ""}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingDoctor ? "Update" : "Create"} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : doctors.length === 0 ? (
        <EmptyState icon="default" title="No doctors found" description="Add your first doctor to get started" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <div key={doc._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow animate-fadeIn">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                      {doc.userId?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{doc.userId?.name || "Doctor"}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{doc.specialization}</p>
                    </div>
                  </div>
                  {user?.role === "admin" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id, doc.userId?.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  {doc.qualification && <p className="text-gray-500 dark:text-gray-400">{doc.qualification}</p>}
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />₹{doc.consultationFee}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doc.experience} yrs</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" />{doc.rating || "N/A"}</span>
                  </div>
                  {doc.availability?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.availability.map((a) => (
                        <span key={a.day} className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                          {a.day.slice(0, 3)} ({a.slots.length})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Doctors;
