import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-red-950 text-white p-8">
                    <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
                    <p className="text-xl mb-4 text-red-200">
                        The application encountered a critical error while rendering this slide.
                    </p>
                    <div className="bg-black/50 p-6 rounded-lg font-mono text-sm overflow-auto max-w-4xl border border-red-800">
                        <p className="text-red-400 font-bold mb-2">{this.state.error?.toString()}</p>
                        <pre className="text-red-500/70">{this.state.errorInfo?.componentStack}</pre>
                    </div>
                    <button
                        className="mt-8 px-6 py-3 bg-red-700 hover:bg-red-600 rounded font-semibold transition"
                        onClick={() => window.location.reload()}
                    >
                        Reload Presentation
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
