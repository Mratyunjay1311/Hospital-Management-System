/**
 * ============================================
 * APPOINTMENTS PAGE — Full API-driven booking system
 * ============================================
 */

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import toast from "react-hot-toast";
import {
  Plus, Search, X, Loader2, CalendarCheck, Clock,
  ChevronLeft, ChevronRight, Filter, Check, XCircle, RefreshCw,
} from "lucide-react";

// Status badge styles
const statusStyles = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    patientId: "", doctorId: "", date: "", slot: "", type: "in-person", reason: "",
  });

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/appointments", {
        params: { page, limit: 10, status: statusFilter || undefined },
      });
      setAppointments(data.data.appointments);
      setPagination(data.data.pagination);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Fetch doctors and patients for the form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [docRes, patRes] = await Promise.all([
          api.get("/doctors", { params: { limit: 50 } }),
          api.get("/patients", { params: { limit: 100 } }),
        ]);
        setDoctors(docRes.data.data.doctors || []);
        setPatients(patRes.data.data.patients || []);
      } catch { /* form data is optional initially */ }
    };
    fetchFormData();
  }, []);

  // Fetch available slots when doctor + date selected
  useEffect(() => {
    const fetchSlots = async () => {
      if (!form.doctorId || !form.date) { setAvailableSlots([]); return; }
      try {
        setSlotsLoading(true);
        const { data } = await api.get(`/doctors/${form.doctorId}/slots`, {
          params: { date: form.date },
        });
        setAvailableSlots(data.data.slots || []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [form.doctorId, form.date]);

  const resetForm = () => {
    setForm({ patientId: "", doctorId: "", date: "", slot: "", type: "in-person", reason: "" });
    setAvailableSlots([]);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId || !form.date || !form.slot) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/appointments", form);
      toast.success("Appointment booked! 🎉");
      resetForm();
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage bookings • {pagination.total || 0} total
          </p>
        </div>
        {["admin", "receptionist", "patient"].includes(user?.role) && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
        </div>
        {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      {/* Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Book Appointment</h2>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Patient Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient *</label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="">Select Patient</option>
                  {patients.map((p) => (<option key={p._id} value={p._id}>{p.name} — {p.email}</option>))}
                </select>
              </div>
              {/* Doctor Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor *</label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value, slot: "" })} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (<option key={d._id} value={d._id}>{d.userId?.name || "Doctor"} — {d.specialization} (₹{d.consultationFee})</option>))}
                </select>
              </div>
              {/* Date + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, slot: "" })} min={new Date().toISOString().split("T")[0]} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="in-person">In Person</option>
                    <option value="video-consultation">Video Call</option>
                  </select>
                </div>
              </div>
              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Slots *</label>
                {slotsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading slots...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((s) => (
                      <button key={s.time} type="button" disabled={s.isBooked}
                        onClick={() => setForm({ ...form, slot: s.time })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          s.isBooked ? "bg-red-100 dark:bg-red-900/30 text-red-400 cursor-not-allowed line-through" :
                          form.slot === s.time ? "bg-blue-600 text-white shadow-md" :
                          "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                ) : form.doctorId && form.date ? (
                  <p className="text-sm text-amber-600 dark:text-amber-400">No slots available for this day. Doctor may not work this day.</p>
                ) : (
                  <p className="text-sm text-gray-400">Select doctor and date to see slots</p>
                )}
              </div>
              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit</label>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} placeholder="Brief description..." className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
              </div>
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting || !form.slot} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Cards */}
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : appointments.length === 0 ? (
        <EmptyState icon="appointments" title="No appointments found" description={statusFilter ? "Try selecting a different status filter" : "Book your first appointment to get started"} />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Patient & Doctor info */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {appt.patientId?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{appt.patientId?.name || "Patient"}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {appt.doctorId?.userId?.name || "Doctor"} • {appt.doctorId?.specialization || ""}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {appt.slot}
                      </span>
                      {appt.tokenNumber && (
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Token #{appt.tokenNumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status + Actions */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusStyles[appt.status] || ""}`}>
                    {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1)}
                  </span>

                  {/* Status Action Buttons */}
                  {["admin", "doctor"].includes(user?.role) && appt.status !== "completed" && appt.status !== "cancelled" && (
                    <div className="flex gap-1.5">
                      {appt.status === "pending" && (
                        <button onClick={() => updateStatus(appt._id, "confirmed")} title="Confirm" className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {appt.status === "confirmed" && (
                        <button onClick={() => updateStatus(appt._id, "completed")} title="Complete" className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => updateStatus(appt._id, "cancelled")} title="Cancel" className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {appt.reason && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 pl-[60px]">
                  <span className="font-medium">Reason:</span> {appt.reason}
                </p>
              )}
            </div>
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Page {pagination.page} of {pagination.pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;