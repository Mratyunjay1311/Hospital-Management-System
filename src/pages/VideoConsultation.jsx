/**
 * ============================================
 * VIDEO CONSULTATION UI
 * ============================================
 */

import { useState } from "react";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Users, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const VideoConsultation = () => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callActive, setCallActive] = useState(true);

  const endCall = () => {
    setCallActive(false);
    toast("Call ended");
  };

  if (!callActive) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Call Ended</h2>
          <p className="text-gray-500 mt-2">The consultation has been completed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 shadow-xl">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div> LIVE
          </div>
          <span className="text-white font-medium text-sm drop-shadow-md">Dr. Rajesh Sharma • Cardiology Consultation</span>
        </div>
        <span className="text-white/80 text-sm font-mono drop-shadow-md">12:45</span>
      </div>

      {/* Main Video Area (Doctor) */}
      <div className="flex-1 relative bg-gray-800 flex items-center justify-center overflow-hidden">
        {/* Placeholder for actual WebRTC video stream */}
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center opacity-30">
            <UserPlaceholder size="120" />
            <p className="text-white mt-4 font-medium">Doctor's Video Feed</p>
          </div>
        </div>
        
        {/* Floating Self View (Patient) */}
        {videoOn && (
          <div className="absolute bottom-24 right-6 w-48 h-64 bg-gray-700 rounded-xl border-2 border-white/20 shadow-2xl overflow-hidden z-20 flex items-center justify-center">
            <div className="text-center opacity-50">
              <UserPlaceholder size="40" />
              <p className="text-white text-xs mt-2">You</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex justify-center items-center gap-6 z-20">
        <button onClick={() => setMicOn(!micOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur' : 'bg-red-500 text-white hover:bg-red-600'}`}>
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        
        <button onClick={() => setVideoOn(!videoOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${videoOn ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur' : 'bg-red-500 text-white hover:bg-red-600'}`}>
          {videoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        
        <button onClick={endCall} className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/40">
          <PhoneOff className="w-6 h-6" />
        </button>

        <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 backdrop-blur transition-colors hidden sm:flex">
          <MessageSquare className="w-5 h-5" />
        </button>
        
        <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 backdrop-blur transition-colors hidden sm:flex">
          <Users className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Simple SVG user placeholder helper
const UserPlaceholder = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default VideoConsultation;
