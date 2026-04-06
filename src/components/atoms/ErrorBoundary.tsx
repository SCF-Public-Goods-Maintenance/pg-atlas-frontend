import React from "react";

type ErrorBoundaryFallback =
  | React.ReactNode
  | ((error: unknown, reset: () => void) => React.ReactNode);

interface ErrorBoundaryProps {
  /**
   * Rendered instead of the children when an error is caught. Can be a
   * static node, or a function that receives the caught error and a
   * `reset()` callback to retry rendering its children.
   */
  fallback: ErrorBoundaryFallback;
  /** Optional side-effect when an error is caught (e.g. logging). */
  onError?: (error: unknown) => void;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: unknown;
}

/**
 * Minimal class-based error boundary so individual panels can fail
 * independently without taking down the whole page.
 *
 * Intended usage:
 * ```tsx
 * <ErrorBoundary fallback={<MetricsGridFallback />}>
 *   <Suspense fallback={<MetricsGridSkeleton />}>
 *     <MetricsGrid />
 *   </Suspense>
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    if ((import.meta as unknown as { env: { DEV: boolean } }).env.DEV) {
      console.warn("[ErrorBoundary] caught", error);
    }
    this.props.onError?.(error);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return typeof this.props.fallback === "function"
        ? this.props.fallback(this.state.error, this.reset)
        : this.props.fallback;
    }
    return this.props.children;
  }
}
