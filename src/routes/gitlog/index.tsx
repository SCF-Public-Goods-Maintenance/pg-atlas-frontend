import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../__root";

const gitlogSearchSchema = z.object({
  pageIndex: z.number().catch(0).optional(),
  pageSize: z.number().catch(20).optional(),
  repo: z.string().catch("").optional(),
});

const GitlogArtifacts = lazy(() => import("../../pages/GitlogArtifacts"));

export const gitlogIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gitlog",
  component: GitlogArtifacts,
  validateSearch: (search) => gitlogSearchSchema.parse(search),
});
