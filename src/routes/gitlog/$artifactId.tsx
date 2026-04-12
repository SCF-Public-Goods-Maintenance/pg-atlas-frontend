import { lazy } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

const GitlogArtifactDetail = lazy(
  () => import("../../pages/GitlogArtifactDetail"),
);

export const gitlogArtifactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gitlog/$artifactId",
  component: GitlogArtifactDetail,
});
