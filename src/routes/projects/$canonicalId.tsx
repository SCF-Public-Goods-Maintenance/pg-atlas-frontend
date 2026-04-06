import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const ProjectDetail = lazy(() => import("../../pages/ProjectDetail"));

export const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$canonicalId",
  component: ProjectDetail,
});
