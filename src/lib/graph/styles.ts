/**
 * Cytoscape stylesheet for the SubGraphExplorer.
 *
 * Colours follow the project's Tailwind palette:
 *   primary-500: #914cff (violet)
 *   primary-600: #7c3aed
 *   surface-dark: #0f0f21
 */
import type { Stylesheet } from "cytoscape";

const NODE_COLORS: Record<string, string> = {
  project: "#914cff",
  repo: "#3b82f6",
  "external-repo": "#64748b",
};

const graphStyles: Stylesheet[] = [
  /* ── default node ───────────────────────────────────────── */
  {
    selector: "node",
    style: {
      label: "data(label)",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "11px",
      "font-family": "Inter, system-ui, sans-serif",
      color: "#94a3b8",
      "text-margin-y": 6,
      "text-max-width": "100px",
      "text-wrap": "ellipsis",
      "background-color": "#3b82f6",
      width: 32,
      height: 32,
      "border-width": 2,
      "border-color": "rgba(255,255,255,0.15)",
      "overlay-padding": 6,
      "transition-property": "background-color, width, height, border-color",
      "transition-duration": 200,
    } as unknown as Record<string, string | number>,
  },

  /* ── node types ─────────────────────────────────────────── */
  {
    selector: "node[nodeType = 'project']",
    style: {
      "background-color": NODE_COLORS.project,
      shape: "round-rectangle" as unknown as string,
      width: 40,
      height: 40,
    } as unknown as Record<string, string | number>,
  },
  {
    selector: "node[nodeType = 'repo']",
    style: {
      "background-color": NODE_COLORS.repo,
    } as unknown as Record<string, string | number>,
  },
  {
    selector: "node[nodeType = 'external-repo']",
    style: {
      "background-color": NODE_COLORS["external-repo"],
      "border-style": "dashed",
      width: 24,
      height: 24,
    } as unknown as Record<string, string | number>,
  },

  /* ── root node ──────────────────────────────────────────── */
  {
    selector: "node[?isRoot]",
    style: {
      "border-width": 3,
      "border-color": "#914cff",
      width: 48,
      height: 48,
      "font-size": "13px",
      "font-weight": "bold" as unknown as number,
      color: "#e2e8f0",
    } as unknown as Record<string, string | number>,
  },

  /* ── loading state ──────────────────────────────────────── */
  {
    selector: "node[?isLoading]",
    style: {
      "border-color": "#fbbf24",
      "border-width": 3,
      "border-style": "dashed",
    } as unknown as Record<string, string | number>,
  },

  /* ── expanded node ──────────────────────────────────────── */
  {
    selector: "node[?isExpanded]",
    style: {
      "border-color": "rgba(145,76,255,0.6)",
    } as unknown as Record<string, string | number>,
  },

  /* ── hover ──────────────────────────────────────────────── */
  {
    selector: "node:active",
    style: {
      "overlay-color": "#914cff",
      "overlay-opacity": 0.15,
    } as unknown as Record<string, string | number>,
  },

  /* ── edges ──────────────────────────────────────────────── */
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "rgba(148,163,184,0.35)",
      "target-arrow-color": "rgba(148,163,184,0.5)",
      "target-arrow-shape": "triangle",
      "arrow-scale": 0.8,
      "curve-style": "bezier",
      "transition-property": "line-color, target-arrow-color",
      "transition-duration": 200,
    } as unknown as Record<string, string | number>,
  },

  /* ── highlighted neighbor edges ──────────────────────────── */
  {
    selector: "edge.highlighted",
    style: {
      "line-color": "rgba(145,76,255,0.6)",
      "target-arrow-color": "rgba(145,76,255,0.7)",
      width: 2.5,
    } as unknown as Record<string, string | number>,
  },

  /* ── dimmed (non-neighbor) ──────────────────────────────── */
  {
    selector: ".dimmed",
    style: {
      opacity: 0.15,
    } as unknown as Record<string, string | number>,
  },
];

export default graphStyles;
