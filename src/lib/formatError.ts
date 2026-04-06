/**
 * Extracts a human-readable message from an unknown caught error.
 *
 * Handles plain Error instances, strings, and the Response-like
 * objects that @hey-api generated SDK clients sometimes throw.
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const maybe = error as {
      message?: string;
      response?: { status?: number; statusText?: string };
      status?: number;
      statusText?: string;
    };
    if (maybe.message) return maybe.message;
    const status = maybe.response?.status ?? maybe.status;
    const text = maybe.response?.statusText ?? maybe.statusText;
    if (status !== undefined) return `HTTP ${status}${text ? ` ${text}` : ""}`;
  }
  return "Unknown error";
}
