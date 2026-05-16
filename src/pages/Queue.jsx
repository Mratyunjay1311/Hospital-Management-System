/**
 * ============================================
 * SMART QUEUE MANAGEMENT
 * ============================================
 * Live OPD queue tracking
 */

import { useState, useEffect } from "react";
import { Users, Activity, CheckCircle, Clock } from "lucide-react";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";

const DUMMY_QUEUES = [
  { id: 1, doctor: "Dr. Rajesh Sharma", room: "101", currentToken: 14, totalWaiting: 5, avgTime: "15 min" },
  { id: 2, doctor: "Dr. Priya Mishra", room: "105", currentToken: 42, totalWaiting: 12, avgTime: "10 min" },
  { id: 3, doctor: "Dr. Amit Patel", room: "203", currentToken: 8, totalWaiting: 2, avgTime: "20 min" },
];

const Queue = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setQueues(DUMMY_QUEUES);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Live OPD Queue
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real-time tracking of Outpatient Department (OPD) queues
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {queues.map((q) => (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
              <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{q.doctor}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Room {q.room}</p>
                
                <div className="mt-8 mb-4 relative inline-block">
                  <div className="w-32 h-32 rounded-full border-8 border-blue-50 dark:border-blue-900/30 flex flex-col items-center justify-center relative z-10 bg-white dark:bg-gray-800">
                    <span className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest">Token</span>
                    <span className="text-5xl font-black text-blue-600 dark:text-blue-400">{q.currentToken}</span>
                  </div>
                  {/* Ping animation behind */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs uppercase font-medium tracking-wider">Waiting</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{q.totalWaiting}</span>
                </div>
                <div className="p-4 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs uppercase font-medium tracking-wider">Est. Wait</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{parseInt(q.avgTime) * q.totalWaiting} m</span>
                </div>
              </div>
              
              <div className="p-4">
                <button className="w-full py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm flex justify-center items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Call Next Patient
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Queue;
