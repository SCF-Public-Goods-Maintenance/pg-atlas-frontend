/**
 * PG Atlas data SDK client configuration.
 *
 * Every query hook under `src/lib/api/queries/*` imports `client` from
 * this module (not from `@pg-atlas/data-sdk` directly). Loading this
 * file applies the `setConfig` call exactly once, on first hook use.
 *
 * Dev: baseUrl defaults to `/api`, proxied server-to-server by Vite (see
 *      `vite.config.ts`) to bypass CORS on localhost.
 * Prod: baseUrl falls through to the SDK default (`https://api.pgatlas.xyz`)
 *       unless `VITE_API_BASE_URL` is set.
 */
import { client } from "@pg-atlas/data-sdk";

const override = import.meta.env.VITE_API_BASE_URL;
const baseUrl = override ?? (import.meta.env.DEV ? "/api" : undefined);

if (baseUrl) {
  client.setConfig({ baseUrl });
}

export { client };
