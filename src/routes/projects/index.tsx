import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../__root";

const sortingItemSchema = z.object({ id: z.string(), desc: z.boolean() });

const projectsSearchSchema = z.object({
  pageIndex: z.number().catch(0).optional(),
  pageSize: z.number().catch(20).optional(),
  search: z.string().catch("").optional(),
  sorting: z.array(sortingItemSchema).catch([]).optional(),
  projectType: z.enum(["public-good", "scf-project"]).optional().catch(undefined),
  activityStatus: z
    .enum(["live", "in-dev", "discontinued", "non-responsive"])
    .optional()
    .catch(undefined),
  category: z.string().optional().catch(undefined),
});

const Projects = lazy(() => import("../../pages/Projects"));

export const projectsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: Projects,
  validateSearch: (search) => projectsSearchSchema.parse(search),
});
