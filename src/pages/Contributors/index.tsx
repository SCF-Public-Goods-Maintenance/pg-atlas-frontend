import { Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";
import MuiThemeProvider from "../../components/atoms/MuiThemeProvider";
import { ErrorBoundary } from "../../components/atoms/ErrorBoundary";
import ContributorsTable from "./components/ContributorsTable";
import {
  ContributorsTableFallback,
  ContributorsTableSkeleton,
} from "./components/ContributorsTableFallbacks";
import { contributorsIndexRoute } from "../../routes/contributors/index";

const SEARCH_DEBOUNCE_MS = 300;

export default function Contributors() {
  const search = contributorsIndexRoute.useSearch();
  const navigate = contributorsIndexRoute.useNavigate();
  const [inputValue, setInputValue] = useState(search.search ?? "");
  const [prevSearch, setPrevSearch] = useState(search.search);

  // Sync input value when URL change (e.g. browser back button) during render phase
  if (search.search !== prevSearch) {
    setPrevSearch(search.search);
    setInputValue(search.search ?? "");
  }

  // Debounce typing so we don't fire a request on every keystroke.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (inputValue !== (search.search ?? "")) {
        navigate({
          search: (prev) => ({
            ...prev,
            search: inputValue.trim() || undefined,
            pageIndex: 0,
          }),
        });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [inputValue, navigate, search.search]);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-surface-dark dark:text-white">
        Contributors
      </h2>
      <p className="mt-3 mb-6 text-base leading-relaxed text-surface-dark/70 dark:text-white/70 max-w-2xl">
        Browse and search contributor profiles across the ecosystem.
      </p>

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-white/15 dark:bg-white/5 dark:shadow-none">
        <Search
          className="ml-2 h-4 w-4 shrink-0 text-surface-dark/40 dark:text-white/40"
          aria-hidden="true"
        />
        <label htmlFor="contributorSearch" className="sr-only">
          Search contributors by name
        </label>
        <input
          id="contributorSearch"
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Search by name"
          className="flex-1 bg-transparent px-1 py-1.5 text-sm text-surface-dark outline-none placeholder:text-surface-dark/30 dark:text-white dark:placeholder:text-white/30"
        />
      </div>

      <MuiThemeProvider>
        <ErrorBoundary fallback={<ContributorsTableFallback />}>
          <Suspense fallback={<ContributorsTableSkeleton />}>
            <ContributorsTable />
          </Suspense>
        </ErrorBoundary>
      </MuiThemeProvider>
    </div>
  );
}
