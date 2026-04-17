/**
 * Transform SDK dependency data into Cytoscape-compatible elements.
 *
 * Handles both project-level (ProjectDependency) and repo-level
 * (RepoDependency) responses, normalizing them into a unified
 * node/edge element array.
 */
import type { ElementDefinition } from "cytoscape";
import type {
  RepoDependency,
  ProjectDependency,
  GraphNodeData,
  GraphNodeType,
  TraversalDirection,
} from "./types";

/* ── helpers ──────────────────────────────────────────────── */

/** Sanitize canonical_id for use as a Cytoscape element id (colons, slashes) */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function makeNodeElement(
  id: string,
  label: string,
  nodeType: GraphNodeType,
  isRoot = false,
): ElementDefinition {
  const data: GraphNodeData & { originalId: string } = {
    id: sanitizeId(id),
    originalId: id,
    label,
    nodeType,
    isRoot,
    expandedDependents: false,
    expandedDependencies: false,
    isLoading: false,
  };
  return { data };
}

function makeEdgeElement(
  sourceId: string,
  targetId: string,
  extra: { edgeCount?: number; confidence?: string } = {},
): ElementDefinition {
  const source = sanitizeId(sourceId);
  const target = sanitizeId(targetId);
  return {
    data: {
      id: `${source}__${target}`,
      source,
      target,
      ...extra,
    },
  };
}

/* ── repo-level transform ─────────────────────────────────── */

export function repoNeighborsToElements(
  focusId: string,
  focusLabel: string,
  neighbors: RepoDependency[],
  direction: TraversalDirection,
  opts: { includeExternal?: boolean } = {},
): ElementDefinition[] {
  const { includeExternal = false } = opts;

  const elements: ElementDefinition[] = [];

  // Root node (only add if it's the first load)
  elements.push(makeNodeElement(focusId, focusLabel, "repo", true));

  for (const dep of neighbors) {
    const nodeType: GraphNodeType =
      dep.vertex_type === "external-repo" ? "external-repo" : "repo";

    if (!includeExternal && nodeType === "external-repo") continue;

    elements.push(makeNodeElement(dep.canonical_id, dep.display_name, nodeType));

    // Edge direction depends on traversal
    if (direction === "dependents") {
      // dep depends on focus → edge FROM dep TO focus
      elements.push(
        makeEdgeElement(dep.canonical_id, focusId, {
          confidence: dep.confidence,
        }),
      );
    } else {
      // focus depends on dep → edge FROM focus TO dep
      elements.push(
        makeEdgeElement(focusId, dep.canonical_id, {
          confidence: dep.confidence,
        }),
      );
    }
  }

  return elements;
}

/* ── project-level transform ──────────────────────────────── */

export function projectNeighborsToElements(
  focusId: string,
  focusLabel: string,
  neighbors: ProjectDependency[],
  direction: TraversalDirection,
): ElementDefinition[] {
  const elements: ElementDefinition[] = [];

  elements.push(makeNodeElement(focusId, focusLabel, "project", true));

  for (const dep of neighbors) {
    const proj = dep.project;
    elements.push(
      makeNodeElement(proj.canonical_id, proj.display_name, "project"),
    );

    if (direction === "dependents") {
      elements.push(
        makeEdgeElement(proj.canonical_id, focusId, {
          edgeCount: dep.edge_count,
        }),
      );
    } else {
      elements.push(
        makeEdgeElement(focusId, proj.canonical_id, {
          edgeCount: dep.edge_count,
        }),
      );
    }
  }

  return elements;
}

/* ── dedup helper ─────────────────────────────────────────── */

/**
 * Merge new elements into an existing element array, skipping
 * any that already exist (by id). This is important for
 * incremental loading where nodes from different hops overlap.
 */
export function mergeElements(
  existing: ElementDefinition[],
  incoming: ElementDefinition[],
): ElementDefinition[] {
  const seen = new Set(existing.map((el) => (el.data as { id: string }).id));
  const merged = [...existing];
  for (const el of incoming) {
    const id = (el.data as { id: string }).id;
    if (!seen.has(id)) {
      seen.add(id);
      merged.push(el);
    }
  }
  return merged;
}

export { sanitizeId };
