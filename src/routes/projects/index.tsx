import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../__root";

const projectsSearchSchema = z.object({
  pageIndex: z.number().catch(0).optional(),
  pageSize: z.number().catch(20).optional(),
  search: z.string().catch("").optional(),
});

const Projects = lazy(() => import("../../pages/Projects"));

export const projectsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: Projects,
  validateSearch: (search) => projectsSearchSchema.parse(search),
});
