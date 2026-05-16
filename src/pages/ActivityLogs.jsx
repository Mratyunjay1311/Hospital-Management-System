/**
 * ============================================
 * ACTIVITY LOGS PAGE (Admin Only)
 * ============================================
 */

import { useState, useEffect } from "react";
import api from "../services/api";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import { Activity, Clock } from "lucide-react";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/activity-logs", { params: { limit: 50 } });
        setLogs(data.data.logs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Audit trail of critical system actions</p>
      </div>

      {loading ? <LoadingSkeleton type="form" count={4} /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-[2rem] w-px bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-6 space-y-6">
            {logs.map((log) => (
              <div key={log._id} className="relative pl-10">
                <div className="absolute left-[-5px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-gray-800"></div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-bold">{log.userId?.name || "System"}</span> {log.description}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1">{log.action}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
