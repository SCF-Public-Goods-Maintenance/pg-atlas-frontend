import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_Updater,
} from "material-react-table";
import MuiThemeProvider from "../../components/atoms/MuiThemeProvider";
import { useReposListSuspense } from "../../lib/api/queries/repos";
import type { RepoSummary } from "@pg-atlas/data-sdk";
import { reposIndexRoute } from "../../routes/repos/index";
import { toSortParam } from "../../lib/api/sorting";

function ReposTable() {
  const genericNavigate = useNavigate();
  const search = reposIndexRoute.useSearch();
  const navigate = reposIndexRoute.useNavigate();

  const pagination: MRT_PaginationState = {
    pageIndex: search.pageIndex ?? 0,
    pageSize: search.pageSize ?? 20,
  };
  const globalFilter = search.search ?? "";
  const sorting: MRT_SortingState = search.sorting ?? [];

  const { data } = useReposListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    ...(globalFilter ? { search: globalFilter } : {}),
    sort: toSortParam(sorting),
  });

  const repos = data?.items ?? [];
  const rowCount = data?.total ?? 0;

  const columns = useMemo<MRT_ColumnDef<RepoSummary>[]>(
    () => [
      {
        accessorKey: "display_name",
        header: "Name",
        size: 220,
      },
      {
        accessorKey: "visibility",
        header: "Visibility",
        size: 120,
      },
      {
        accessorKey: "latest_version",
        header: "Version",
        size: 120,
      },
      {
        accessorKey: "criticality_score",
        header: "Criticality",
        size: 120,
        Cell: ({ cell }) => {
          const v = cell.getValue<number | null>();
          return v != null ? Math.round(v).toLocaleString() : "—";
        },
      },
      {
        accessorKey: "pony_factor",
        header: "Pony Factor",
        size: 120,
        Cell: ({ cell }) => {
          const v = cell.getValue<number | null>();
          return v != null ? Math.round(v).toLocaleString() : "—";
        },
      },
      {
        accessorKey: "adoption_stars",
        header: "Stars",
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue<number | null>()?.toLocaleString() ?? "—",
      },
      {
        accessorKey: "adoption_forks",
        header: "Forks",
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue<number | null>()?.toLocaleString() ?? "—",
      },
      {
        accessorKey: "latest_commit_date",
        header: "Last Commit",
        size: 140,
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? new Date(val).toLocaleDateString() : "—";
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: repos,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount,

    /* ── pagination ─────────────────────────────────────── */
    onPaginationChange: (updater: MRT_Updater<MRT_PaginationState>) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      navigate({
        search: (prev) => ({
          ...prev,
          pageIndex: next.pageIndex,
          pageSize: next.pageSize,
        }),
      });
    },

    /* ── global search ─────────────────────────────────── */
    onGlobalFilterChange: (updater: MRT_Updater<string>) => {
      const next = typeof updater === "function" ? updater(globalFilter) : updater;
      navigate({
        search: (prev) => ({
          ...prev,
          search: next || undefined,
          pageIndex: 0,
        }),
      });
    },

    /* ── sorting ───────────────────────────────────────── */
    onSortingChange: (updater: MRT_Updater<MRT_SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      navigate({
        search: (prev) => ({
          ...prev,
          sorting: next.length > 0 ? next : undefined,
          pageIndex: 0,
        }),
      });
    },

    state: { pagination, globalFilter, sorting },
    initialState: { density: "compact" },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        genericNavigate({
          to: "/repos/$canonicalId",
          params: { canonicalId: row.original.canonical_id },
        }),
      sx: { cursor: "pointer" },
    }),
  });

  return <MaterialReactTable table={table} />;
}

export default function Repos() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">
        Repos
      </h2>
      <p className="mt-3 mb-6 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Browse repositories tracked across the Stellar ecosystem.
      </p>
      <MuiThemeProvider>
        <ReposTable />
      </MuiThemeProvider>
    </div>
  );
}
