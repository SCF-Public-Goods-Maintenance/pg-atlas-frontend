/**
 * Graph Explorer type definitions.
 *
 * Bridges @pg-atlas/data-sdk types to Cytoscape element model.
 */
import type { RepoDependency, ProjectDependency } from "@pg-atlas/data-sdk";

/* ── traversal direction ──────────────────────────────────── */

export type TraversalDirection = "dependents" | "dependencies";

/* ── node types ───────────────────────────────────────────── */

export type GraphNodeType = "project" | "repo" | "external-repo";

export interface GraphNodeData {
  id: string;
  label: string;
  nodeType: GraphNodeType;
  /** True for the node placed at the center of the graph */
  isRoot: boolean;
  /** True if this node's neighbors have been loaded */
  isExpanded: boolean;
  /** True while neighbors are being fetched */
  isLoading: boolean;
}

/* ── edge types ───────────────────────────────────────────── */

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  edgeCount?: number;
  confidence?: string;
}

/* ── component props ──────────────────────────────────────── */

export type GraphPageType = "project" | "repo";

export interface SubGraphExplorerProps {
  /** canonical_id of the focus entity */
  canonicalId: string;
  /** Display name for the root node label */
  displayName: string;
  /** Whether this is on a project or repo detail page */
  pageType: GraphPageType;
}

/* ── re-exports for convenience ───────────────────────────── */

export type { RepoDependency, ProjectDependency };
