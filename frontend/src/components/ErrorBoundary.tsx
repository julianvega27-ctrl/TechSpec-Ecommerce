import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-geist">Something went wrong</h1>
            <p className="text-gray-600 mb-6 font-geist">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              className="bg-primary text-white px-6 py-2 rounded font-geist hover:bg-cyan-600 transition-colors"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
