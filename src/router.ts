import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { aboutRoute } from "./routes/about";
import { settingsRoute } from "./routes/settings";
import { graphRoute } from "./routes/graph";
import { roundsIndexRoute } from "./routes/rounds/index";
import { roundRoute } from "./routes/rounds/$roundId";
import { contributorsIndexRoute } from "./routes/contributors/index";
import { contributorRoute } from "./routes/contributors/$id";
import { projectsIndexRoute } from "./routes/projects/index";
import { projectRoute } from "./routes/projects/$canonicalId";
import { reposIndexRoute } from "./routes/repos/index";
import { repoRoute } from "./routes/repos/$canonicalId";

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  settingsRoute,
  graphRoute,
  roundsIndexRoute,
  roundRoute,
  contributorsIndexRoute,
  contributorRoute,
  projectsIndexRoute,
  projectRoute,
  reposIndexRoute,
  repoRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
