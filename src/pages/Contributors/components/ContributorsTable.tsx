import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_Updater,
} from "material-react-table";
import type { ContributorSummary } from "@pg-atlas/data-sdk";
import { useContributorsListSuspense } from "../../../lib/api/queries/contributors";
import { contributorsIndexRoute } from "../../../routes/contributors/index";

/**
 * Paginated contributor table backed by `listContributors`.
 * Search and pagination state are synchronized with the URL.
 */
export default function ContributorsTable() {
  const genericNavigate = useNavigate();
  const searchParams = contributorsIndexRoute.useSearch();
  const navigate = contributorsIndexRoute.useNavigate();

  const pagination: MRT_PaginationState = {
    pageIndex: searchParams.pageIndex ?? 0,
    pageSize: searchParams.pageSize ?? 20,
  };

  const { data } = useContributorsListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: searchParams.search || null,
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
    state: { pagination },
    initialState: { density: "compact" },
    enableColumnActions: false,
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableSorting: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        genericNavigate({
          to: "/contributors/$id",
          params: { id: String(row.original.id) },
        }),
      sx: { cursor: "pointer" },
    }),
  });

  return <MaterialReactTable table={table} />;
}
