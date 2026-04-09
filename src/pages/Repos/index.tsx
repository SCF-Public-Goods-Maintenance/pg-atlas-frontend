import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import MuiThemeProvider from "../../components/atoms/MuiThemeProvider";
import { useReposListSuspense } from "../../lib/api/queries/repos";
import type { RepoSummary } from "@pg-atlas/data-sdk";

function ReposTable() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data } = useReposListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
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
        Cell: ({ cell }) => cell.getValue<number | null>()?.toFixed(2) ?? "—",
      },
      {
        accessorKey: "pony_factor",
        header: "Pony Factor",
        size: 120,
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
    rowCount,
    onPaginationChange: setPagination,
    state: { pagination },
    initialState: { density: "compact" },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        navigate({
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
