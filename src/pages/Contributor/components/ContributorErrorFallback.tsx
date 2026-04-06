import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Breadcrumb } from "../../../components/atoms/Breadcrumb";
import { formatError } from "../../../lib/formatError";

export function ContributorErrorFallback({
  contributorId,
  error,
  onRetry,
}: {
  contributorId: string;
  error: unknown;
  onRetry: () => void;
}) {
  const message = formatError(error);

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Contributors", href: "/contributors" },
          { label: "Contributor unavailable" },
        ]}
      />
      <h2 className="text-3xl font-bold text-surface-dark dark:text-white">
        Contributor unavailable
      </h2>
      <p className="mt-2 text-base text-surface-dark/70 dark:text-white/70">
        Contributor #{contributorId}
      </p>

      <div className="mt-8 flex flex-1 items-start justify-center">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900/30 dark:bg-red-900/10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle
                className="h-5 w-5 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-red-800 dark:text-red-200">
                We couldn't load this contributor
              </h3>
              <p className="mt-1 text-sm text-red-700/80 dark:text-red-200/70">
                Retry, or return to the contributors list.
              </p>
              <pre className="mt-3 max-h-24 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-red-200 bg-white/50 px-3 py-2 text-xs font-mono text-red-900 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-200">
                {message}
              </pre>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Retry
                </button>
                <Link
                  to="/contributors"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-red-800 transition-colors hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to Contributors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
