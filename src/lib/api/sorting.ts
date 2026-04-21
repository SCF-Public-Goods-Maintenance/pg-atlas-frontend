/**
 * Converts MRT_SortingState to the SDK's `sort` query parameter format.
 *
 * MRT represents sorting as `[{ id: "field", desc: true }]`.
 * The backend expects a comma-separated string: `"field:desc,other:asc"`.
 *
 * Returns `undefined` when there is nothing to sort (so the param is omitted).
 */
import type { MRT_SortingState } from "material-react-table";

export function toSortParam(
  sorting: MRT_SortingState | undefined,
): string | undefined {
  if (!sorting || sorting.length === 0) return undefined;
  return sorting
    .filter((s) => s.id && !s.id.includes(':') && !s.id.includes(',')) // sorting by id with : or , will break the query
    .map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`)
    .join(",");
}
