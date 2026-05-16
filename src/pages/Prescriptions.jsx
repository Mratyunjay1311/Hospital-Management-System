/**
 * ============================================
 * PRESCRIPTIONS PAGE
 * ============================================
 */

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import toast from "react-hot-toast";
import {
  Plus, Search, Trash2, Loader2, Pill, Calendar,
  ChevronLeft, ChevronRight, FileText, X
} from "lucide-react";

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patientId: "", diagnosis: "", notes: "", nextVisitDate: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]
  });

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/prescriptions", { params: { page, limit: 10 } });
      setPrescriptions(data.data.prescriptions);
      setPagination(data.data.pagination);
    } catch {
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/patients", { params: { limit: 100 } });
        setPatients(data.data.patients || []);
      } catch {}
    };
    if (user?.role === "doctor") fetchPatients();
  }, [user]);

  const resetForm = () => {
    setForm({
      patientId: "", diagnosis: "", notes: "", nextVisitDate: "",
      medicines: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]
    });
    setShowForm(false);
  };

  const addMedicine = () => {
    setForm({ ...form, medicines: [...form.medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }] });
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = [...form.medicines];
    newMedicines[index][field] = value;
    setForm({ ...form, medicines: newMedicines });
  };

  const removeMedicine = (index) => {
    const newMedicines = form.medicines.filter((_, i) => i !== index);
    setForm({ ...form, medicines: newMedicines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosis || !form.medicines[0].name) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/prescriptions", form);
      toast.success("Prescription created");
      resetForm();
      fetchPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prescription?")) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      toast.success("Prescription deleted");
      fetchPrescriptions();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage electronic prescriptions
          </p>
        </div>
        {user?.role === "doctor" && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Prescription
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Prescription</h2>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient *</label>
                  <select
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diagnosis *</label>
                  <input
                    value={form.diagnosis}
                    onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                    required
                    placeholder="e.g. Viral Fever"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medicines *</label>
                  <button type="button" onClick={addMedicine} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Medicine
                  </button>
                </div>
                <div className="space-y-3">
                  {form.medicines.map((med, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <input value={med.name} onChange={(e) => updateMedicine(index, "name", e.target.value)} required placeholder="Medicine name" className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-blue-500" />
                        <input value={med.dosage} onChange={(e) => updateMedicine(index, "dosage", e.target.value)} placeholder="Dosage (e.g. 500mg)" className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-blue-500" />
                        <input value={med.frequency} onChange={(e) => updateMedicine(index, "frequency", e.target.value)} placeholder="Frequency (e.g. 1-0-1)" className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-blue-500" />
                        <input value={med.duration} onChange={(e) => updateMedicine(index, "duration", e.target.value)} placeholder="Duration (e.g. 5 days)" className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-blue-500" />
                        <input value={med.instructions} onChange={(e) => updateMedicine(index, "instructions", e.target.value)} placeholder="Instructions (e.g. After food)" className="col-span-2 lg:col-span-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-1 focus:ring-blue-500" />
                      </div>
                      {form.medicines.length > 1 && (
                        <button type="button" onClick={() => removeMedicine(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Visit</label>
                  <input type="date" value={form.nextVisitDate} onChange={(e) => setForm({ ...form, nextVisitDate: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={resetForm} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : prescriptions.length === 0 ? (
        <EmptyState icon="default" title="No prescriptions" description="No prescriptions found." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Rx for {rx.patientId?.name || "Unknown"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    By Dr. {rx.doctorId?.userId?.name || "Unknown"} • {new Date(rx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {["admin", "doctor"].includes(user?.role) && (
                  <button onClick={() => handleDelete(rx._id)} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Diagnosis</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{rx.diagnosis}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Medicines ({rx.medicines?.length || 0})</p>
                  <div className="space-y-2">
                    {rx.medicines?.map((med, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                        <Pill className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{med.name} <span className="text-gray-500 font-normal">({med.dosage})</span></p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{med.frequency} for {med.duration}</p>
                          {med.instructions && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">{med.instructions}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {rx.nextVisitDate && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Next Visit:</span> {new Date(rx.nextVisitDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
