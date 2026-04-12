import type { SubmissionStatus } from "@pg-atlas/data-sdk";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  processed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

/**
 * Small pill rendering gitlog artifact status. Colors mirror the
 * pending / processed / failed enum exposed by the SDK.
 */
export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
