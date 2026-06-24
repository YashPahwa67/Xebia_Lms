import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

// Catches render errors anywhere below it and shows a branded recovery screen
// instead of a blank white page.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production this is where you'd report to an error service.
    console.error('Render error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-md rounded-3xl border border-line/70 bg-white p-10 text-center shadow-glow">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-cta/10 text-cta">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-xl font-semibold text-ink">Something went wrong</h1>
          <p className="mt-1.5 text-sm text-slate/70">
            An unexpected error occurred. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex rounded-full bg-plum px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-plum-dark"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
