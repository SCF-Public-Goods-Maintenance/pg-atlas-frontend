import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const RepoDetail = lazy(() => import("../../pages/RepoDetail"));

export const repoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repos/$canonicalId",
  component: RepoDetail,
});
