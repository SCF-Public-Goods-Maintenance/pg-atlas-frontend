import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../__root";

const contributorsSearchSchema = z.object({
  pageIndex: z.number().catch(0).optional(),
  pageSize: z.number().catch(20).optional(),
  search: z.string().catch("").optional(),
});

const Contributors = lazy(() => import("../../pages/Contributors"));

export const contributorsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contributors",
  component: Contributors,
  validateSearch: (search) => contributorsSearchSchema.parse(search),
});
