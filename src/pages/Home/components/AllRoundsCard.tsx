import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { RoundRow } from "../../../types";
import { roundList } from "../../../data/rounds";
import { Skeleton } from "../../../components/atoms/Skeleton";

const roundColumnHelper = createColumnHelper<RoundRow>();

/** Skeleton rows render at the same natural row height as real data
 *  (`px-4 py-2`, ~36px each). Only used if a future caller wraps the
 *  card in Suspense — current data source is synchronous. */
const SKELETON_ROW_COUNT = 12;

/**
 * Derive the table rows from the static round config in `src/data/rounds`.
 * The first entry in `roundList` is the most recent, which we mark as the
 * current/active round per the spec's "all-rounds index" section.
 */
function buildRoundRows(): RoundRow[] {
  return roundList.map((round, idx) => ({
    roundId: `${round.year}Q${round.quarter}`,
    label: `Round ${round.year}Q${round.quarter}${
      idx === 0 ? " (Current)" : ""
    }`,
    isCurrent: idx === 0,
  }));
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      {children}
    </div>
  );
}

function Header({
  right,
}: {
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
        All Rounds
      </h3>
      {right}
    </div>
  );
}

/**
 * Tabular index of every curated round from `src/data/rounds/*.json`.
 * Data is static (imported at build time), so no Suspense is required,
 * but an `ErrorBoundary` wrapper is still recommended in case future
 * config parsing fails.
 */
export default function AllRoundsCard() {
  const data = useMemo(buildRoundRows, []);

  const columns = useMemo(
    () => [
      roundColumnHelper.display({
        id: "index",
        header: "#",
        cell: (info) => (
          <span className="text-sm text-surface-dark/30 dark:text-white/20">
            {info.row.index + 1}
          </span>
        ),
      }),
      roundColumnHelper.accessor("label", {
        header: "Round",
        cell: (info) => (
          <span
            className={`font-medium ${
              info.row.original.isCurrent
                ? "text-surface-dark dark:text-white"
                : "text-surface-dark/70 dark:text-white/60"
            }`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      roundColumnHelper.accessor("isCurrent", {
        header: "Status",
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className="text-sm text-surface-dark/40 dark:text-white/70">
              Closed
            </span>
          ),
      }),
      roundColumnHelper.display({
        id: "action",
        header: () => <span className="block text-right">Action</span>,
        cell: (info) => (
          <div className="text-right">
            <Link
              to="/rounds/$roundId"
              params={{ roundId: String(info.row.original.roundId) }}
              className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
            >
              View →
            </Link>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <CardShell>
      <Header
        right={
          <span className="text-xs text-surface-dark/40 dark:text-white/70">
            {data.length} rounds
          </span>
        }
      />
      <div className="flex-1 overflow-auto">
        <div className="h-full overflow-hidden rounded-xl border border-gray-100 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-gray-100 bg-gray-50/50 dark:border-white/10 dark:bg-white/[0.02]"
                >
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-sm font-medium uppercase tracking-wide text-surface-dark/40 dark:text-white/70"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.03]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CardShell>
  );
}

/** Future-use skeleton fallback (not used today — data is synchronous). */
export function AllRoundsCardSkeleton() {
  return (
    <CardShell>
      <Header right={<Skeleton className="h-3 w-14" />} />
      <div
        className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-100 dark:border-white/10"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="flex shrink-0 border-b border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-medium uppercase tracking-wide text-surface-dark/40 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/70">
          <div className="w-8">#</div>
          <div className="flex-1">Round</div>
          <div className="w-20">Status</div>
          <div className="w-16 text-right">Action</div>
        </div>
        <div className="flex flex-col divide-y divide-gray-50 dark:divide-white/5">
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="flex items-center px-4 py-2"
            >
              <div className="w-8">
                <Skeleton className="h-3 w-4" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="w-20">
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="w-16 text-right">
                <Skeleton className="ml-auto h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

/** Error-state fallback — minimal placeholder. */
export function AllRoundsCardFallback() {
  return (
    <CardShell>
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-white/10">
        <p className="text-sm font-medium text-surface-dark/60 dark:text-white/70">
          Round index unavailable
        </p>
      </div>
    </CardShell>
  );
}
