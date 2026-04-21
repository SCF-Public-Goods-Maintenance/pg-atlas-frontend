import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../__root";

const sortingItemSchema = z.object({ id: z.string(), desc: z.boolean() });

const reposSearchSchema = z.object({
  pageIndex: z.number().catch(0).optional(),
  pageSize: z.number().catch(20).optional(),
  search: z.string().catch("").optional(),
  sorting: z.array(sortingItemSchema).catch([]).optional(),
});

const Repos = lazy(() => import("../../pages/Repos"));

export const reposIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repos",
  component: Repos,
  validateSearch: (search) => reposSearchSchema.parse(search),
});
