import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import ProjectDetail from "../../pages/ProjectDetail/ProjectDetail";

export const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$canonicalId",
  component: ProjectDetail,
});
