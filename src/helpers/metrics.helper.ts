import { Counter } from "prom-client";

/**
 * Counter for tracking rejected authentication requests.
 */
export const HTTP_REJECTED_AUTH = new Counter({
  help: "The number of authentication requests that were rejected",
  labelNames: ["auth_method"],
  name: "da_fastify_rejected_auth_requests",
});

/**
 * Counter for caught server errors, by statusCode
 */
export const THROWN_ERRORS = new Counter({
  help: "The number of authentication requests that were rejected",
  labelNames: ["status_code"],
  name: "da_fastify_thrown_errors",
});
