/**
 * PG Atlas data SDK client configuration.
 *
 * Every query hook under `src/lib/api/queries/*` imports `client` from
 * this module (not from `@pg-atlas/data-sdk` directly). Loading this
 * file applies the `setConfig` call exactly once, on first hook use.
 *
 * The client connects directly to the backend API.
 * By default it points to the SDK's built-in URL (e.g. `https://api.pgatlas.xyz`).
 * We rely on the backend enforcing CORS so that any origin can fetch data.
 */
import { client } from "@pg-atlas/data-sdk";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (baseUrl) {
  client.setConfig({ baseUrl });
}

export { client };
