/**
 * ============================================
 * CHAT SYSTEM UI
 * ============================================
 */

import { useState } from "react";
import { Search, Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";

const USERS = [
  { id: 1, name: "Dr. Rajesh Sharma", role: "Cardiologist", avatar: "R", online: true, unread: 2, lastMsg: "Please check the reports.", time: "10:30 AM" },
  { id: 2, name: "Dr. Priya Mishra", role: "Dermatologist", avatar: "P", online: false, unread: 0, lastMsg: "Yes, the appointment is confirmed.", time: "Yesterday" },
  { id: 3, name: "Reception", role: "Front Desk", avatar: "H", online: true, unread: 0, lastMsg: "Patient arriving in 5 mins.", time: "Monday" },
];

const MESSAGES = [
  { id: 1, text: "Hello doctor, I have sent the ECG reports of patient John Doe.", time: "10:15 AM", isMe: true },
  { id: 2, text: "I'll review them right away.", time: "10:20 AM", isMe: false },
  { id: 3, text: "Please check the reports.", time: "10:30 AM", isMe: false },
];

const Chat = () => {
  const [activeUser, setActiveUser] = useState(USERS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search contacts..." className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {USERS.map((u) => (
            <button key={u.id} onClick={() => setActiveUser(u)} className={`w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeUser.id === u.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {u.avatar}
                </div>
                {u.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{u.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.lastMsg}</p>
                  {u.unread > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{u.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
              {activeUser.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeUser.name}</p>
              <p className="text-xs text-gray-500">{activeUser.role} {activeUser.online ? "• Online" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <button className="hover:text-blue-600"><Phone className="w-5 h-5" /></button>
            <button className="hover:text-blue-600"><Video className="w-5 h-5" /></button>
            <button className="hover:text-gray-900"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${m.isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm"}`}>
                <p>{m.text}</p>
                <div className={`flex items-center gap-1 mt-1 justify-end text-[10px] ${m.isMe ? "text-blue-200" : "text-gray-400"}`}>
                  <span>{m.time}</span>
                  {m.isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
