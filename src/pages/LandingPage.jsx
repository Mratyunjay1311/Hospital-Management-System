import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Heart, 
  CalendarCheck, 
  FileText, 
  Stethoscope, 
  Video, 
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
  Users
} from "lucide-react";

const features = [
  {
    icon: <CalendarCheck className="w-6 h-6 text-blue-600" />,
    title: "Smart Scheduling",
    description: "Book and manage appointments seamlessly with real-time availability tracking."
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-600" />,
    title: "Electronic Medical Records",
    description: "Secure, centralized access to patient histories, prescriptions, and lab reports."
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-green-600" />,
    title: "AI Symptom Checker",
    description: "Intelligent symptom analysis to help patients understand potential conditions."
  },
  {
    icon: <Video className="w-6 h-6 text-indigo-600" />,
    title: "Telemedicine",
    description: "High-quality video consultations connecting doctors and patients from anywhere."
  },
  {
    icon: <Activity className="w-6 h-6 text-red-600" />,
    title: "Live Queue Management",
    description: "Real-time queue tracking to reduce patient wait times and optimize clinic flow."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
    title: "Secure Billing",
    description: "Automated invoicing, payment tracking, and insurance claim management."
  }
];

const stats = [
  { value: "10k+", label: "Patients Served", icon: <Users className="w-5 h-5" /> },
  { value: "50+", label: "Specialist Doctors", icon: <Stethoscope className="w-5 h-5" /> },
  { value: "24/7", label: "Emergency Care", icon: <Clock className="w-5 h-5" /> },
  { value: "99%", label: "Patient Satisfaction", icon: <Heart className="w-5 h-5" /> }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-500/30">
      
      {/* ── Navbar ── */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                MedCare
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">About Us</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">Contact</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link 
                to="/login"
                className="hidden md:block px-5 py-2.5 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-blue-50/50 via-indigo-50/20 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 -z-10 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-6 border border-blue-200 dark:border-blue-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Hospital Management v2.0 is Live
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Healthcare management, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">reimagined.</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A unified platform for hospitals and clinics to manage appointments, electronic medical records, billing, and tele-consultations effortlessly.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/25 transition-all duration-200 hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                Sign In to Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-10 border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm mb-3">
              Comprehensive Modules
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to run a modern hospital.
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              MedCare provides a complete suite of tools designed specifically for healthcare professionals, patients, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your healthcare facility?
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of doctors and hospitals who are already using MedCare to deliver better patient experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 font-bold rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">MedCare</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} MedCare Systems. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
