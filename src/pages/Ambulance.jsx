/**
 * ============================================
 * AMBULANCE REQUEST MODULE
 * ============================================
 */

import { useState } from "react";
import { Ambulance as AmbulanceIcon, MapPin, PhoneCall, AlertTriangle, CheckCircle, Navigation } from "lucide-react";
import toast from "react-hot-toast";

const Ambulance = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [location, setLocation] = useState("");
  const [emergencyType, setEmergencyType] = useState("Cardiac Arrest");
  
  const handleRequest = (e) => {
    e.preventDefault();
    if(!location) return toast.error("Please provide your location");
    
    // Simulate API request
    toast.success("Ambulance dispatched!");
    setRequestSent(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AmbulanceIcon className="w-6 h-6 text-red-500" />
          Emergency Ambulance
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Request an ambulance immediately. Average response time: 8-12 mins.
        </p>
      </div>

      {!requestSent ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900 overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 border-b border-red-100 dark:border-red-900 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
            <h2 className="text-red-800 dark:text-red-400 font-bold">Emergency Request Form</h2>
          </div>
          
          <form onSubmit={handleRequest} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Type</label>
              <select 
                value={emergencyType} 
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
              >
                <option value="Cardiac Arrest">Cardiac Arrest / Heart Attack</option>
                <option value="Accident">Accident / Trauma</option>
                <option value="Stroke">Stroke</option>
                <option value="Respiratory">Severe Respiratory Distress</option>
                <option value="Pregnancy">Pregnancy / Labor</option>
                <option value="Other">Other Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pickup Location (Be specific)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street, Landmark, City..." 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
                />
                <button type="button" onClick={() => setLocation("Current GPS Location (Simulated)")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 transition-all">
              <AmbulanceIcon className="w-6 h-6 animate-pulse" />
              DISPATCH AMBULANCE NOW
            </button>
            <p className="text-center text-xs text-gray-500">By clicking this, an ambulance will be dispatched to your location immediately.</p>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ambulance Dispatched!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Vehicle MH-12-AB-1234 is en route to <span className="font-semibold text-gray-900 dark:text-white">{location}</span> for a {emergencyType} emergency.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl max-w-sm mx-auto mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Driver</span>
              <span className="font-semibold text-gray-900 dark:text-white">Ramesh Kumar</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">ETA</span>
              <span className="font-bold text-red-600 dark:text-red-400">7 mins away</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <MapPin className="w-4 h-4" /> Track Live
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm">
              <PhoneCall className="w-4 h-4" /> Call Driver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ambulance;
