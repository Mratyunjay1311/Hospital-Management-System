import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left overflow-auto max-h-40 mb-8 text-xs font-mono text-gray-800 dark:text-gray-300">
              <p className="font-bold text-red-600 dark:text-red-400 mb-1">{this.state.error && this.state.error.toString()}</p>
              <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-5 h-5" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
