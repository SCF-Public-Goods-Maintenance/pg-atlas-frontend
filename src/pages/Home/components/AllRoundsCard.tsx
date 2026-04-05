import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { AllRoundsCardProps, RoundRow } from "../../../types";

const roundColumnHelper = createColumnHelper<RoundRow>();

export default function AllRoundsCard({ overview }: AllRoundsCardProps) {
  const data = overview?.roundsIndex ?? [];

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
              className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
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
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-white/5 dark:border-white/15">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-surface-dark dark:text-white">
          All Rounds
        </h3>
        <span className="text-xs text-surface-dark/40 dark:text-white/70">
          {data.length} rounds
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="h-full overflow-hidden rounded-xl border border-gray-100 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]"
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
                  className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
