/**
 * ============================================
 * EMR PAGE (Electronic Medical Records)
 * ============================================
 */

import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import toast from "react-hot-toast";
import { Search, FileText, Activity, Heart, Thermometer, User } from "lucide-react";

const EMR = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/patients", { params: { search, limit: 20 } });
        setPatients(data.data.patients);
      } catch {
        toast.error("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setRecordsLoading(true);
    try {
      const { data } = await api.get(`/emr/${patient._id}`);
      setRecords(data.data);
    } catch {
      toast.error("Failed to load records");
    } finally {
      setRecordsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar: Patient List */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shadow-sm flex-shrink-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Select Patient</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />)}
            </div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No patients found</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {patients.map(p => (
                <button
                  key={p._id}
                  onClick={() => selectPatient(p)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedPatient?._id === p._id ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600" : "border-l-4 border-transparent"
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.email}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Patient Records */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shadow-sm">
        {!selectedPatient ? (
          <EmptyState icon="patients" title="No patient selected" description="Select a patient from the list to view their medical records" />
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPatient.name}</h2>
                <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>{selectedPatient.gender || "Unknown"}</span>
                  {selectedPatient.bloodGroup && <span>Blood: {selectedPatient.bloodGroup}</span>}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Medical History</h3>
              {recordsLoading ? (
                <LoadingSkeleton type="form" count={2} />
              ) : records.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  No medical records found for this patient.
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                  {records.map((record) => (
                    <div key={record._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        <Activity className="w-4 h-4" />
                      </div>
                      
                      {/* Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{record.diagnosis}</p>
                          <span className="text-xs text-gray-500">{new Date(record.visitDate).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">Dr. {record.doctorId?.userId?.name || "Unknown"}</p>
                        
                        {record.vitals && (
                          <div className="flex gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                            {record.vitals.bloodPressure && <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> {record.vitals.bloodPressure}</span>}
                            {record.vitals.temperature && <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-amber-500" /> {record.vitals.temperature}°F</span>}
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          {record.symptoms && (
                            <div><span className="text-xs font-semibold text-gray-900 dark:text-gray-300">Symptoms: </span><span className="text-xs text-gray-600 dark:text-gray-400">{record.symptoms.join(", ")}</span></div>
                          )}
                          {record.treatmentNotes && (
                            <div><span className="text-xs font-semibold text-gray-900 dark:text-gray-300">Notes: </span><span className="text-xs text-gray-600 dark:text-gray-400">{record.treatmentNotes}</span></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EMR;
