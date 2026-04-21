import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFiltersState,
  type MRT_Updater,
} from "material-react-table";
import MuiThemeProvider from "../../components/atoms/MuiThemeProvider";
import { useProjectsListSuspense } from "../../lib/api/queries/projects";
import type { ProjectSummary } from "@pg-atlas/data-sdk";
import { projectsIndexRoute } from "../../routes/projects/index";
import { toSortParam } from "../../lib/api/sorting";

function ProjectsTable() {
  const genericNavigate = useNavigate();
  const search = projectsIndexRoute.useSearch();
  const navigate = projectsIndexRoute.useNavigate();

  const pagination: MRT_PaginationState = {
    pageIndex: search.pageIndex ?? 0,
    pageSize: search.pageSize ?? 20,
  };
  const globalFilter = search.search ?? "";
  const sorting: MRT_SortingState = search.sorting ?? [];

  /* ── map column filters from URL params ────────────── */
  const columnFilters: MRT_ColumnFiltersState = useMemo(() => {
    const filters: MRT_ColumnFiltersState = [];
    if (search.projectType) filters.push({ id: "project_type", value: search.projectType });
    if (search.activityStatus) filters.push({ id: "activity_status", value: search.activityStatus });
    if (search.category) filters.push({ id: "category", value: search.category });
    return filters;
  }, [search.projectType, search.activityStatus, search.category]);

  const { data } = useProjectsListSuspense({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    ...(globalFilter ? { search: globalFilter } : {}),
    sort: toSortParam(sorting),
    project_type: search.projectType ?? undefined,
    activity_status: search.activityStatus ?? undefined,
    category: search.category ?? undefined,
  });

  const projects = data?.items ?? [];
  const rowCount = data?.total ?? 0;

  const columns = useMemo<MRT_ColumnDef<ProjectSummary>[]>(
    () => [
      {
        accessorKey: "display_name",
        header: "Name",
        size: 220,
        enableColumnFilter: false,
      },
      {
        accessorKey: "project_type",
        header: "Type",
        size: 130,
        filterVariant: "select",
        filterSelectOptions: [
          { label: "Public Good", value: "public-good" },
          { label: "SCF Project", value: "scf-project" },
        ],
      },
      {
        accessorKey: "activity_status",
        header: "Status",
        size: 130,
        filterVariant: "select",
        filterSelectOptions: [
          { label: "Live", value: "live" },
          { label: "In Dev", value: "in-dev" },
          { label: "Discontinued", value: "discontinued" },
          { label: "Non-responsive", value: "non-responsive" },
        ],
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
        filterVariant: "text",
      },
      {
        accessorKey: "criticality_score",
        header: "Criticality",
        size: 120,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const v = cell.getValue<number | null>();
          return v != null ? Math.round(v).toLocaleString() : "—";
        },
      },
      {
        accessorKey: "adoption_score",
        header: "Adoption",
        size: 120,
        enableColumnFilter: false,
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
    manualSorting: true,
    rowCount,
    enableColumnFilters: true,

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

    /* ── column filters ────────────────────────────────── */
    onColumnFiltersChange: (updater: MRT_Updater<MRT_ColumnFiltersState>) => {
      const next = typeof updater === "function" ? updater(columnFilters) : updater;
      const get = (id: string) => {
        const f = next.find((f) => f.id === id);
        return (f?.value as string) || undefined;
      };
      navigate({
        search: (prev) => ({
          ...prev,
          projectType: get("project_type"),
          activityStatus: get("activity_status"),
          category: get("category"),
          pageIndex: 0,
        }),
      });
    },

    state: { pagination, globalFilter, sorting, columnFilters },
    initialState: { density: "compact", showColumnFilters: false },
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
