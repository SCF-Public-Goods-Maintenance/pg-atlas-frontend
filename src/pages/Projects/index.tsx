import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_Updater,
} from "material-react-table";
import MuiThemeProvider from "../../components/atoms/MuiThemeProvider";
import { useProjectsListSuspense } from "../../lib/api/queries/projects";
import type { ProjectSummary } from "@pg-atlas/data-sdk";
import { projectsIndexRoute } from "../../routes/projects/index";

function ProjectsTable() {
  const genericNavigate = useNavigate();
  const search = projectsIndexRoute.useSearch();
  const navigate = projectsIndexRoute.useNavigate();

  const pagination: MRT_PaginationState = {
    pageIndex: search.pageIndex ?? 0,
    pageSize: search.pageSize ?? 20,
  };
  const globalFilter = search.search ?? "";

  const { data } = useProjectsListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    ...(globalFilter ? { search: globalFilter } : {}),
  });

  const projects = data?.items ?? [];
  const rowCount = data?.total ?? 0;

  const columns = useMemo<MRT_ColumnDef<ProjectSummary>[]>(
    () => [
      {
        accessorKey: "display_name",
        header: "Name",
        size: 220,
      },
      {
        accessorKey: "project_type",
        header: "Type",
        size: 130,
      },
      {
        accessorKey: "activity_status",
        header: "Status",
        size: 130,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
      },
      {
        accessorKey: "pony_factor",
        header: "Pony Factor",
        size: 120,
      },
      {
        accessorKey: "criticality_score",
        header: "Criticality",
        size: 120,
        Cell: ({ cell }) => cell.getValue<number | null>()?.toFixed(2) ?? "—",
      },
      {
        accessorKey: "adoption_score",
        header: "Adoption",
        size: 120,
        Cell: ({ cell }) => cell.getValue<number | null>()?.toFixed(2) ?? "—",
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: projects,
    manualPagination: true,
    manualFiltering: true,
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
    state: { pagination, globalFilter },
    initialState: { density: "compact" },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () =>
        genericNavigate({
          to: "/projects/$canonicalId",
          params: { canonicalId: row.original.canonical_id },
        }),
      sx: { cursor: "pointer" },
    }),
  });

  return <MaterialReactTable table={table} />;
}

export default function Projects() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">
        Projects
      </h2>
      <p className="mt-3 mb-6 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Browse SCF-funded projects across the Stellar ecosystem.
      </p>
      <MuiThemeProvider>
        <ProjectsTable />
      </MuiThemeProvider>
    </div>
  );
}
