/**
 * PG Atlas data SDK client configuration.
 *
 * Every query hook under `src/lib/api/queries/*` imports `client` from
 * this module (not from `@pg-atlas/data-sdk` directly). Loading this
 * file applies the `setConfig` call exactly once, on first hook use.
 *
 * Local (dev + preview): baseUrl defaults to `/api`, server-side proxied by
 *   Vite (`server.proxy` / `preview.proxy` in vite.config.ts) so the browser
 *   never makes a cross-origin request and CORS is a non-issue.
 *
 * Deployed production: requests go to `/api` relative to the serving origin.
 *   This requires a server-side reverse proxy routing /api/* to api.pgatlas.xyz
 *   (e.g. nginx, CDN rewrite rule, or a DO App Platform service). Until that
 *   proxy exists, set VITE_API_BASE_URL=https://api.pgatlas.xyz at build time
 *   AND ensure api.pgatlas.xyz sends CORS headers for the pgatlas.xyz origin.
 *   See BACKEND_GAPS.md for tracking.
 */
import { client } from "@pg-atlas/data-sdk";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

client.setConfig({ baseUrl });

export { client };
