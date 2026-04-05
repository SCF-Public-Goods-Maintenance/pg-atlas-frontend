import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import RepoDetail from "../../pages/RepoDetail/RepoDetail";

export const repoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/repos/$canonicalId",
  component: RepoDetail,
});
