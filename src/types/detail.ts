import type { ComponentType } from "react";

/**
 * A single metric entry for `MetricsPanel` cards on the Repo/Project
 * detail pages. `value` is nullable because the backend may not yet
 * have computed a score for newer records.
 */
export interface Metric {
  label: string;
  value: number | null | undefined;
  icon: ComponentType<{ className?: string }>;
  provenance: string;
  /** Controls how the value is displayed. Defaults to `'integer'`. */
  format?: "integer" | "decimal";
}
