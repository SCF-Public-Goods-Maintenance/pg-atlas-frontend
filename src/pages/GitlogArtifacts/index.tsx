import { Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";
import MuiThemeProvider from "../../components/atoms/MuiThemeProvider";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
import ArtifactsTable from "./components/ArtifactsTable";
import {
  ArtifactsTableFallback,
  ArtifactsTableSkeleton,
} from "./components/ArtifactsTableFallbacks";

const FILTER_DEBOUNCE_MS = 300;

/**
 * Gitlog artifacts list — ops/debug surface showing every `git log`
 * processing attempt against tracked repos. Backed by
 * `listGitlogArtifacts`; supports repo-canonical-id filtering.
 */
export default function GitlogArtifacts() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedRepo, setDebouncedRepo] = useState("");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedRepo(inputValue.trim());
    }, FILTER_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [inputValue]);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">
        Gitlog Artifacts
      </h2>
      <p className="mt-3 mb-6 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Processing attempts against tracked repos. Click a row to inspect
        the raw artifact and any error detail.
      </p>

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-white/15 dark:bg-white/5 dark:shadow-none">
        <Search
          className="ml-2 h-4 w-4 shrink-0 text-surface-dark/40 dark:text-white/40"
          aria-hidden="true"
        />
        <label htmlFor="repoFilter" className="sr-only">
          Filter by repo canonical id
        </label>
        <input
          id="repoFilter"
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Filter by repo canonical id (exact match)"
          className="flex-1 bg-transparent px-1 py-1.5 text-sm text-surface-dark outline-none placeholder:text-surface-dark/30 dark:text-white dark:placeholder:text-white/30"
        />
      </div>

      <MuiThemeProvider>
        <ErrorBoundary fallback={<ArtifactsTableFallback />}>
          <Suspense fallback={<ArtifactsTableSkeleton />}>
            <ArtifactsTable repo={debouncedRepo} />
          </Suspense>
        </ErrorBoundary>
      </MuiThemeProvider>
    </div>
  );
}
