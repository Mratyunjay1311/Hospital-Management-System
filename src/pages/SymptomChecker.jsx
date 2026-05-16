/**
 * ============================================
 * AI SYMPTOM CHECKER UI
 * ============================================
 * A dynamic chat-like interface simulating an AI diagnosis tool
 */

import { useState, useRef, useEffect } from "react";
import { Stethoscope, Send, User, Bot, Loader2, AlertCircle } from "lucide-react";

const INITIAL_MESSAGE = {
  role: "ai",
  content: "Hello! I'm your MedCare AI Health Assistant. Please describe your symptoms in detail (e.g., 'I have had a headache and mild fever for 2 days'). I will analyze them and suggest potential conditions or recommend seeing a doctor."
};

const SymptomChecker = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = userMessage.content.toLowerCase();

      // Basic hardcoded logic for portfolio demonstration
      if (lowerInput.includes("headache") && lowerInput.includes("fever")) {
        aiResponse = "Based on 'headache' and 'fever', this could be a viral infection or flu. Ensure you stay hydrated and rest. If the fever exceeds 102°F or lasts more than 3 days, please book a consultation with a General Physician.";
      } else if (lowerInput.includes("stomach") || lowerInput.includes("pain") || lowerInput.includes("nausea")) {
        aiResponse = "Stomach pain and nausea can indicate food poisoning, gastritis, or an infection. Eat light, bland foods. If pain is severe or you experience vomiting for more than 24 hours, seek medical attention.";
      } else if (lowerInput.includes("cough") || lowerInput.includes("cold")) {
        aiResponse = "A cough and cold are typical of upper respiratory infections. Try warm fluids and throat lozenges. If you experience shortness of breath or chest pain, please visit the emergency room immediately.";
      } else {
        aiResponse = "Thank you for sharing your symptoms. Because your symptoms can be associated with various conditions, I highly recommend booking an appointment with one of our doctors for a proper clinical diagnosis.";
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          AI Symptom Checker
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Describe your symptoms for a preliminary AI analysis.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4 flex items-start gap-3 flex-shrink-0">
        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-500">
          <strong className="font-bold">Disclaimer:</strong> This tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. In a medical emergency, call an ambulance immediately.
        </p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"}`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-tl-none flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., I have been experiencing a mild headache..."
              className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
