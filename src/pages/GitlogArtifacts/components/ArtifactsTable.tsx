import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import type { GitLogArtifactSummary, SubmissionStatus } from "@pg-atlas/data-sdk";
import { useGitlogArtifactsListSuspense } from "../../../lib/api/queries/gitlog";
import { StatusBadge } from "./StatusBadge";

interface ArtifactsTableProps {
  repo: string;
}

/**
 * Paginated table of gitlog processing attempts. `repo` filters by
 * repo canonical_id (exact match) — controlled by the parent so the
 * filter input can debounce independently.
 */
export default function ArtifactsTable({ repo }: ArtifactsTableProps) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data } = useGitlogArtifactsListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    repo: repo || null,
  });

  const items = data?.items ?? [];
  const rowCount = data?.total ?? 0;

  const columns = useMemo<MRT_ColumnDef<GitLogArtifactSummary>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "repo_display_name",
        header: "Repo",
        size: 220,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        Cell: ({ cell }) => (
          <StatusBadge status={cell.getValue<SubmissionStatus>()} />
        ),
      },
      {
        accessorKey: "since_months",
        header: "Window (mo)",
        size: 120,
      },
      {
        accessorKey: "submitted_at",
        header: "Submitted",
        size: 160,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
      },
      {
        accessorKey: "processed_at",
        header: "Processed",
        size: 160,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string | null>()),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: items,
    manualPagination: true,
    rowCount,
    onPaginationChange: setPagination,
    state: { pagination },
    initialState: { density: "compact" },
    enableColumnActions: false,
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableSorting: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        navigate({
          to: "/gitlog/$artifactId",
          params: { artifactId: String(row.original.id) },
        }),
      sx: { cursor: "pointer" },
    }),
  });

  return <MaterialReactTable table={table} />;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}
