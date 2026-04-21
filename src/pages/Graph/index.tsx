import { Network, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export default function Graph() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-dark dark:text-white">Graph Explorer</h2>
      <p className="mt-1 text-sm text-surface-dark/70 dark:text-white/70">
        Interactive dependency graph visualization
      </p>

      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-20 dark:border-white/15 dark:bg-white/[0.02]">
        {/* Decorative graph SVG */}
        <div className="relative mb-6">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" className="text-surface-dark/10 dark:text-white/10">
            <circle cx="80" cy="40" r="12" stroke="currentColor" strokeWidth="2" />
            <circle cx="40" cy="90" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="120" cy="90" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="30" cy="50" r="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="135" cy="55" r="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="73" y1="50" x2="46" y2="82" stroke="currentColor" strokeWidth="1.5" />
            <line x1="87" y1="50" x2="114" y2="82" stroke="currentColor" strokeWidth="1.5" />
            <line x1="36" y1="54" x2="68" y2="38" stroke="currentColor" strokeWidth="1.5" />
            <line x1="129" y1="59" x2="92" y2="42" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="90" x2="110" y2="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Network className="h-8 w-8 text-primary-500/30" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-surface-dark dark:text-white">Coming in v1</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-surface-dark/50 dark:text-white/40">
          Full interactive dependency graph with search, filtering, and node exploration. Explore repository-level subgraphs on detail pages in the meantime.
        </p>

        <Link
          to="/repos"
          className="group mt-6 inline-flex items-center gap-1.5 rounded-xl bg-surface-dark px-4 py-2 text-sm font-medium text-white hover:bg-surface-dark/85 dark:bg-white dark:text-surface-dark dark:hover:bg-white/90 transition-colors"
        >
          Browse repos
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
