import { Link } from "@tanstack/react-router";
import { ArrowRight, Network } from "lucide-react";
import type { RepoDependency } from "@pg-atlas/data-sdk";

export function DependenciesPanel({
  dependsOn,
  hasDependents,
}: {
  dependsOn: RepoDependency[];
  hasDependents: RepoDependency[];
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-white/15 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Dependencies
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-surface-dark/60 dark:bg-white/10 dark:text-white/50">
          <Network className="h-4 w-4" aria-hidden="true" />
          {dependsOn.length} out &middot; {hasDependents.length} in
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <DepList
          title="Depends on"
          items={dependsOn}
          emptyText="This repo has no outgoing dependencies."
          icon={<ArrowRight className="h-4 w-4" />}
        />
        <DepList
          title="Has dependents"
          items={hasDependents}
          emptyText="No other repos currently depend on this."
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
  items: RepoDependency[];
  emptyText: string;
  icon: React.ReactNode;
}) {
  const internal = items.filter((i) => i.vertex_type === "repo");
  const external = items.filter((i) => i.vertex_type === "external-repo");

  return (
    <div className="rounded-xl border border-gray-100 p-4 dark:border-white/10">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-surface-dark/60 dark:text-white/50">
        {icon}
        {title}
        <span className="ml-auto text-surface-dark/30 dark:text-white/30">
          {items.length}
        </span>
      </div>
      {items.length === 0 || (internal.length === 0 && external.length === 0) ? (
        <p className="text-sm text-surface-dark/50 dark:text-white/40">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-4">
          {internal.length > 0 && (
            <ul className="space-y-1">
              {internal.map((dep) => (
                <li key={dep.canonical_id}>
                  <DepItem dep={dep} isInternal={true} />
                </li>
              ))}
            </ul>
          )}
          {external.length > 0 && (
            <div className="space-y-2">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-surface-dark/40 dark:text-white/30">
                External Repos
              </div>
              <ul className="space-y-1">
                {external.map((dep) => (
                  <li key={dep.canonical_id}>
                    <DepItem dep={dep} isInternal={false} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DepItem({
  dep,
  isInternal,
}: {
  dep: RepoDependency;
  isInternal: boolean;
}) {
  const content = (
    <>
      <span className="truncate">{dep.display_name}</span>
      <div className="ml-2 flex shrink-0 items-center gap-2">
        {dep.confidence && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              dep.confidence === "verified-sbom"
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
            }`}
          >
            {dep.confidence === "verified-sbom" ? "verified" : "inferred"}
          </span>
        )}
        {dep.version_range && (
          <span className="text-sm font-mono text-surface-dark/40 dark:text-white/30">
            {dep.version_range}
          </span>
        )}
      </div>
    </>
  );

  const className =
    "flex items-center justify-between rounded-lg px-3 py-2 text-base text-surface-dark transition-colors dark:text-white";

  if (isInternal) {
    return (
      <Link
        to="/repos/$canonicalId"
        params={{ canonicalId: dep.canonical_id }}
        className={`${className} hover:bg-gray-50 dark:hover:bg-white/5`}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
