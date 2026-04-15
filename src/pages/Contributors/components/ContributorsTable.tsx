import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import type { ContributorSummary } from "@pg-atlas/data-sdk";
import { useContributorsListSuspense } from "../../../lib/api/queries/contributors";

interface ContributorsTableProps {
  search: string;
}

/**
 * Paginated contributor table backed by `listContributors`. Search is
 * controlled by the parent so the input can debounce independently of
 * the table's own pagination state.
 */
export default function ContributorsTable({ search }: ContributorsTableProps) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data } = useContributorsListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: search || null,
  });

  const contributors = data?.items ?? [];
  const rowCount = data?.total ?? 0;

  const columns = useMemo<MRT_ColumnDef<ContributorSummary>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 260,
      },
      {
        accessorKey: "email_hash",
        header: "Email Hash",
        size: 280,
        Cell: ({ cell }) => (
          <span className="font-mono text-xs">
            {cell.getValue<string>()}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: contributors,
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
          to: "/contributors/$id",
          params: { id: String(row.original.id) },
        }),
      sx: { cursor: "pointer" },
    }),
  });

  return <MaterialReactTable table={table} />;
}
