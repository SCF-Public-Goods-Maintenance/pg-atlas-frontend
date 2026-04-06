import { Link } from "@tanstack/react-router";
import { ArrowRight, Network } from "lucide-react";
import type { ProjectDependency } from "@pg-atlas/data-sdk";

export function DependenciesPanel({
  dependsOn,
  hasDependents,
}: {
  dependsOn: ProjectDependency[];
  hasDependents: ProjectDependency[];
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Dependencies
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          <Network className="h-4 w-4" aria-hidden="true" />
          {dependsOn.length} out · {hasDependents.length} in
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <DepList
          title="Depends on"
          items={dependsOn}
          emptyText="This project has no outgoing dependencies."
          icon={<ArrowRight className="h-4 w-4" />}
        />
        <DepList
          title="Has dependents"
          items={hasDependents}
          emptyText="No other projects currently depend on this."
          icon={<ArrowRight className="h-4 w-4 rotate-180" />}
        />
      </div>
    </section>
  );
}

function DepList({
  title,
  items,
  emptyText,
  icon,
}: {
  title: string;
  items: ProjectDependency[];
  emptyText: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-4 dark:border-white/10">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-surface-dark/60 dark:text-white/50">
        {icon}
        {title}
        <span className="ml-auto text-surface-dark/30 dark:text-white/30">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-surface-dark/50 dark:text-white/40">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((dep) => (
            <li key={dep.project.canonical_id}>
              <Link
                to="/projects/$canonicalId"
                params={{ canonicalId: dep.project.canonical_id }}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-base text-surface-dark transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
              >
                <span className="truncate">{dep.project.display_name}</span>
                <span className="ml-2 shrink-0 text-sm text-surface-dark/50 dark:text-white/40">
                  {dep.edge_count} edge{dep.edge_count === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
