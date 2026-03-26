import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SettingsPage from './pages/SettingsPage'
import RoundPage from './pages/RoundPage'
import ContributorPage from './pages/ContributorPage'
import RoundsIndexPage from './pages/RoundsIndexPage'
import ContributorsIndexPage from './pages/ContributorsIndexPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import RepoDetailPage from './pages/RepoDetailPage'
import GraphExplorerPage from './pages/GraphExplorerPage'

const rootRoute = createRootRoute({
  component: DashboardLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

const roundsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rounds',
  component: RoundsIndexPage,
})

const contributorsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contributors',
  component: ContributorsIndexPage,
})

const roundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rounds/$roundId',
  component: RoundPage,
})

const contributorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contributors/$id',
  component: ContributorPage,
})

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$canonicalId',
  component: ProjectDetailPage,
})

const repoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/repos/$canonicalId',
  component: RepoDetailPage,
})

const graphExplorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/graph',
  component: GraphExplorerPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  settingsRoute,
  roundsIndexRoute,
  contributorsIndexRoute,
  roundRoute,
  contributorRoute,
  projectRoute,
  repoRoute,
  graphExplorerRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
