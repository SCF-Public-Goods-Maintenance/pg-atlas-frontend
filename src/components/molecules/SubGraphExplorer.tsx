/**
 * SubGraphExplorer — interactive, incremental dependency graph viewer.
 *
 * Placed on ProjectDetail and RepoDetail pages.
 * Uses Cytoscape.js (imperative, via useRef) for rendering.
 *
 * Core UX:
 * - Central focus node with one hop of neighbors loaded initially.
 * - Click a neighbor node → fetch *its* neighbors → add to graph.
 * - Toggle between "dependents" (incoming) and "dependencies" (outgoing).
 * - Hover → highlight immediate neighborhood.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import cytoscape, { type Core, type EventObject } from "cytoscape";
import { ArrowDownLeft, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";


import {
  getRepoDependsOn,
  getRepoHasDependents,
  getProjectDependsOn,
  getProjectHasDependents,
} from "@pg-atlas/data-sdk";
import { client } from "../../lib/api/client";

import {
  graphStyles,
  repoNeighborsToElements,
  projectNeighborsToElements,
  sanitizeId,
} from "../../lib/graph";
import type {
  SubGraphExplorerProps,
  TraversalDirection,
  GraphNodeData,
  RepoDependency,
  ProjectDependency,
} from "../../lib/graph";

/* ── component ────────────────────────────────────────────── */

export default function SubGraphExplorer({
  canonicalId,
  displayName,
  pageType,
}: SubGraphExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [direction, setDirection] = useState<TraversalDirection>("dependents");
  const directionRef = useRef<TraversalDirection>(direction);
  const [nodeCount, setNodeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── fetch neighbors for a given node ────────────────────── */

  const fetchNeighbors = useCallback(
    async (nodeCanonicalId: string, dir: TraversalDirection) => {
      if (pageType === "repo") {
        const fetcher =
          dir === "dependents" ? getRepoHasDependents : getRepoDependsOn;
        const { data } = await fetcher({
          client,
          path: { canonical_id: nodeCanonicalId },
          throwOnError: true,
        });
        return { type: "repo" as const, data: (data ?? []) as RepoDependency[] };
      } else {
        const fetcher =
          dir === "dependents"
            ? getProjectHasDependents
            : getProjectDependsOn;
        const { data } = await fetcher({
          client,
          path: { canonical_id: nodeCanonicalId },
          throwOnError: true,
        });
        return {
          type: "project" as const,
          data: (data ?? []) as ProjectDependency[],
        };
      }
    },
    [pageType],
  );

  /* ── add neighbors to the graph ──────────────────────────── */

  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expandNode = useCallback(
    async (nodeCanonicalId: string, nodeLabel: string, dir: TraversalDirection) => {
      const cy = cyRef.current;
      if (!cy) return;

      const safeId = sanitizeId(nodeCanonicalId);
      const node = cy.getElementById(safeId);

      // Already expanded in this direction? Skip.
      if (node.data("isExpanded")) return;

      node.data("isLoading", true);
      setLoading(true);
      setError(null);

      try {
        const result = await fetchNeighbors(nodeCanonicalId, dir);

        let newElements;
        if (result.type === "repo") {
          newElements = repoNeighborsToElements(
            nodeCanonicalId,
            nodeLabel,
            result.data,
            dir,
            { includeExternal: false },
          );
        } else {
          newElements = projectNeighborsToElements(
            nodeCanonicalId,
            nodeLabel,
            result.data,
            dir,
          );
        }

        // Filter out elements already in the graph
        const existingIds = new Set(
          cy.elements().map((el) => el.id()),
        );
        const toAdd = newElements.filter(
          (el) => !existingIds.has((el.data as { id: string }).id),
        );

        if (toAdd.length > 0) {
          cy.add(toAdd);

          // Re-run layout only on the new nodes + their neighborhood
          const addedNodes = cy.collection();
          for (const el of toAdd) {
            const added = cy.getElementById((el.data as { id: string }).id);
            if (added.length > 0) addedNodes.merge(added);
          }

          // Lock existing nodes in place, layout only new ones
          cy.nodes().forEach((n) => {
            if (!addedNodes.contains(n)) {
              n.lock();
            }
          });

          cy.layout({
            name: "cose",
            animate: true,
            animationDuration: 400,
            fit: false,
            padding: 40,
            nodeRepulsion: () => 8000,
            idealEdgeLength: () => 90,
            gravity: 0.15,
            randomize: false,
          } as cytoscape.LayoutOptions).run();

          // Unlock after layout
          unlockTimeoutRef.current = setTimeout(() => {
            cyRef.current?.nodes().unlock();
          }, 500);
        }

        node.data("isExpanded", true);
        node.data("isLoading", false);
        setNodeCount(cy.nodes().length);
      } catch (err) {
        node.data("isLoading", false);
        setError(err instanceof Error ? err.message : "Failed to load neighbors");
      } finally {
        setLoading(false);
      }
    },
    [fetchNeighbors],
  );

  /* ── initialize Cytoscape ────────────────────────────────── */

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      style: graphStyles,
      layout: { name: "preset" },
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.3,
    });

    cyRef.current = cy;

    // Add root node at center
    const rootId = sanitizeId(canonicalId);
    cy.add({
      data: {
        id: rootId,
        label: displayName,
        nodeType: pageType === "project" ? "project" : "repo",
        isRoot: true,
        isExpanded: false,
        isLoading: false,
      } as GraphNodeData,
      position: { x: 0, y: 0 },
    });

    cy.center();
    setNodeCount(1);

    // Load initial neighbors
    expandNode(canonicalId, displayName, direction);

    /* ── click handler: expand on tap ──────────────────────── */
    const handleTap = (evt: EventObject) => {
      const node = evt.target;
      if (!node.isNode()) return;

      const data = node.data() as GraphNodeData & { originalId?: string };
      if (data.isExpanded || data.isLoading) return;
      if (data.nodeType === "external-repo") return; // non-expandable

      const originalId = data.originalId;
      if (!originalId) return;

      expandNode(originalId, data.label, directionRef.current);
    };

    cy.on("tap", "node", handleTap);

    /* ── hover: highlight neighborhood ─────────────────────── */
    cy.on("mouseover", "node", (evt) => {
      const node = evt.target;
      const neighborhood = node.closedNeighborhood();
      cy.elements().not(neighborhood).addClass("dimmed");
      neighborhood.connectedEdges().addClass("highlighted");
    });

    cy.on("mouseout", "node", () => {
      cy.elements().removeClass("dimmed").removeClass("highlighted");
    });

    return () => {
      if (unlockTimeoutRef.current) {
        clearTimeout(unlockTimeoutRef.current);
      }
    };
    // Only run on mount — direction changes handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalId, displayName, pageType]);

  /* ── handle direction change: rebuild graph ──────────────── */

  const handleDirectionChange = useCallback(
    (newDir: TraversalDirection) => {
      setDirection(newDir);
      directionRef.current = newDir;

      const cy = cyRef.current;
      if (!cy) return;

      // Remove all except root
      const rootId = sanitizeId(canonicalId);
      cy.elements().forEach((el) => {
        if (el.id() !== rootId) el.remove();
      });

      const root = cy.getElementById(rootId);
      root.data("isExpanded", false);
      root.position({ x: 0, y: 0 });

      setNodeCount(1);
      expandNode(canonicalId, displayName, newDir);
    },
    [canonicalId, displayName, expandNode],
  );

  /* ── reset graph ─────────────────────────────────────────── */

  const handleReset = useCallback(() => {
    handleDirectionChange(direction);
  }, [direction, handleDirectionChange]);

  /* ── fit to viewport ─────────────────────────────────────── */

  const handleFit = useCallback(() => {
    cyRef.current?.fit(undefined, 40);
  }, []);

  /* ── render ──────────────────────────────────────────────── */

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-xs dark:border-white/15 dark:bg-white/5">
      {/* ── toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-3 dark:border-white/10">
        <h3 className="text-base font-semibold text-surface-dark dark:text-white">
          Dependency Graph
        </h3>

        <span className="ml-auto text-xs text-surface-dark/50 dark:text-white/40">
          {nodeCount} node{nodeCount !== 1 ? "s" : ""}
        </span>

        {/* direction toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-white/15">
          <button
            type="button"
            onClick={() => handleDirectionChange("dependents")}
            className={`flex items-center gap-1.5 rounded-l-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              direction === "dependents"
                ? "bg-primary-500 text-white"
                : "text-surface-dark/60 hover:bg-gray-50 dark:text-white/50 dark:hover:bg-white/10"
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            Dependents
          </button>
          <button
            type="button"
            onClick={() => handleDirectionChange("dependencies")}
            className={`flex items-center gap-1.5 rounded-r-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              direction === "dependencies"
                ? "bg-primary-500 text-white"
                : "text-surface-dark/60 hover:bg-gray-50 dark:text-white/50 dark:hover:bg-white/10"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Dependencies
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-gray-200 p-1.5 text-surface-dark/50 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-white/40 dark:hover:bg-white/10"
          title="Reset graph"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleFit}
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-surface-dark/50 transition-colors hover:bg-gray-50 dark:border-white/15 dark:text-white/40 dark:hover:bg-white/10"
        >
          Fit
        </button>
      </div>

      {/* ── canvas ───────────────────────────────────────────── */}
      <div className="relative">
        {loading && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg bg-surface-dark/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </div>
        )}
        {error && (
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            {error}
          </div>
        )}
        <div
          ref={containerRef}
          className="h-[400px] w-full cursor-grab active:cursor-grabbing"
          style={{ background: "linear-gradient(135deg, #0f0f21 0%, #1a1a2e 100%)" }}
        />
      </div>

      {/* ── legend ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 px-5 py-2.5 text-xs text-surface-dark/50 dark:border-white/10 dark:text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#914cff]" />
          Project
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
          Repo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-dashed border-[#64748b] bg-[#64748b]" />
          External
        </span>
        <span className="ml-auto text-[10px] italic">
          Click a node to expand · Hover to highlight
        </span>
      </div>
    </section>
  );
}
