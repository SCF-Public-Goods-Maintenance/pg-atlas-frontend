import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  Trophy,
  ArrowUpRight,
  Github,
  CircleCheck,
  Wrench,
  CircleDashed,
  SearchX,
  ArrowLeft,
  ArrowUpDown,
  Search,
  GitPullRequest,
  Vote,
  Globe,
} from "lucide-react";
import type { ProjectSummary } from "@pg-atlas/data-sdk";
import type { RoundData } from "../../types/rounds";
import { getRound } from "../../data/rounds";
import { Breadcrumb } from "../../components/atoms/Breadcrumb";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";

/**
 * Display row merges a static round-config entry with its live
 * ProjectSummary (when the canonical_id is set and matches).
 */
interface RoundRow {
  canonicalId: string;
  displayName: string;
  summary: ProjectSummary | null;
  proposalPrUrl?: string;
  tansuProposalUrl?: string;
  projectPageUrl?: string;
}

function buildRows(
  config: RoundData,
): RoundRow[] {
  return config.projects.map((p) => ({
    canonicalId: p.canonical_id ?? "",
    displayName: p.name,
    summary: null,
    proposalPrUrl: p.proposal_pr_url,
    tansuProposalUrl: p.tansu_proposal_url,
    projectPageUrl: p.project_page_url,
  }));
}

const columnHelper = createColumnHelper<RoundRow>();

function useRoundColumns() {
  return useMemo(
    () => [
      columnHelper.accessor("displayName", {
        header: "Project",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col">
              {row.canonicalId ? (
                <Link
                  to="/projects/$canonicalId"
                  params={{ canonicalId: row.canonicalId }}
                  className="font-semibold text-surface-dark hover:text-primary-500 dark:text-white"
                >
                  {row.displayName}
                </Link>
              ) : (
                <span className="font-semibold text-surface-dark/60 dark:text-white/60">
                  {row.displayName}
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "links",
        header: () => <span className="block text-right">Links</span>,
        meta: { align: "right" },
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex justify-end gap-3 text-surface-dark/40 dark:text-white/40">
              {row.proposalPrUrl && (
                <a
                  href={row.proposalPrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-500"
                  title="Proposal PR"
                  aria-label="Proposal PR"
                >
                  <GitPullRequest className="h-4 w-4" />
                </a>
              )}
              {row.tansuProposalUrl && (
                <a
                  href={row.tansuProposalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-500"
                  title="Tansu Proposal"
                  aria-label="Tansu Proposal"
                >
                  <Vote className="h-4 w-4" />
                </a>
              )}
              {row.projectPageUrl && (
                <a
                  href={row.projectPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-500"
                  title="Project Page"
                  aria-label="Project Page"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {row.canonicalId && (
                <Link
                  to="/projects/$canonicalId"
                  params={{ canonicalId: row.canonicalId }}
                  className="hover:text-primary-500"
                  aria-label="Details"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          );
        },
      }),
    ],
    [],
  );
}

/* ── page wrapper with Suspense + ErrorBoundary ───────────── */

export default function Round() {
  const { roundId } = useParams({ from: "/rounds/$roundId" });
  return (
    <ErrorBoundary fallback={<RoundErrorFallback roundId={roundId} />}>
      <RoundContent roundId={roundId} />
    </ErrorBoundary>
  );
}

/* ── main content ─────────────────────────────────────────── */

function RoundHeader({
  roundId,
  name,
  votingClosed,
}: {
  roundId: string;
  name?: string;
  votingClosed?: string | Date;
}) {
  const formattedDate = votingClosed instanceof Date
    ? votingClosed.toLocaleDateString()
    : votingClosed;
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Rounds", href: "/rounds" },
          { label: `Round ${roundId}` },
        ]}
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-surface-dark dark:text-white">
            {name ?? "PG Award"} {roundId}
          </h2>
        </div>
        <p className="text-sm text-surface-dark/70 dark:text-white/70">
          Voting Closed: {formattedDate ?? "TBD"}
        </p>
      </div>
    </>
  );
}

function RoundContent({ roundId }: { roundId: string }) {
  const [config, setConfig] = useState<RoundData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getRound(roundId).then((data) => {
      if (active) {
        setConfig(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [roundId]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const rows = useMemo(() => {
    if (!config) return [];
    return buildRows(config);
  }, [config]);

  const columns = useRoundColumns();

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-10 w-64 rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-96 w-full rounded-2xl bg-gray-200 dark:bg-white/10" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="space-y-6">
        <RoundHeader roundId={roundId} />
        <EmptyRoundState roundId={roundId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RoundHeader
        roundId={roundId}
        name={config.name}
        votingClosed={config.voting_closed}
      />

      {rows.length === 0 ? (
        <EmptyRoundState roundId={roundId} />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-dark/30 dark:text-white/30" />
              <input
                type="text"
                placeholder="Search projects..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/15 dark:bg-white/5 dark:text-white"
              />
            </div>
            <span className="text-xs text-surface-dark/40 dark:text-white/30">
              {table.getFilteredRowModel().rows.length} of {rows.length} projects
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/15 dark:bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-surface-dark/50 dark:bg-white/5 dark:text-white/50">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => {
                        const align = (
                          header.column.columnDef.meta as { align?: string }
                        )?.align;
                        return (
                          <th
                            key={header.id}
                            className={`px-6 py-4 ${align === "right"
                                ? "text-right"
                                : align === "center"
                                  ? "text-center"
                                  : ""
                              } ${header.column.getCanSort()
                                ? "cursor-pointer select-none hover:text-surface-dark/70 dark:hover:text-white/70"
                                : ""
                              }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div
                              className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""
                                }`}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {header.column.getCanSort() && (
                                <ArrowUpDown className="h-3 w-3 opacity-40" />
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const align = (
                          cell.column.columnDef.meta as { align?: string }
                        )?.align;
                        return (
                          <td
                            key={cell.id}
                            className={`px-6 py-4 ${align === "right"
                                ? "text-right"
                                : align === "center"
                                  ? "text-center"
                                  : ""
                              } dark:text-white/80`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-surface-dark/50 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/30">
            Voting takes place on <strong>Tansu</strong> — PG Atlas does not
            embed Tansu or display voting outcomes. This leaderboard is for
            informational context only.
          </div>
        </>
      )}
    </div>
  );
}

/* ── auxiliary states ─────────────────────────────────────── */

function EmptyRoundState({ roundId }: { roundId: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-16 text-center dark:border-white/15 dark:bg-white/[0.02]">
      <SearchX className="mx-auto h-10 w-10 text-surface-dark/15 dark:text-white/10" />
      <h3 className="mt-4 text-base font-semibold text-surface-dark dark:text-white">
        No projects found
      </h3>
      <p className="mt-1 text-sm text-surface-dark/50 dark:text-white/40">
        Round "{roundId}" doesn't have any matching projects yet.
      </p>
      <Link
        to="/rounds"
        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Choose another round
      </Link>
    </div>
  );
}


function RoundErrorFallback({ roundId }: { roundId: string }) {
  return (
    <div className="space-y-6">
      <RoundHeader roundId={roundId} />
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/20 dark:bg-red-900/10">
        <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
          Failed to load round data
        </h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300/80">
          The projects list couldn't be fetched. Please retry on your next
          refresh.
        </p>
      </div>
    </div>
  );
}
