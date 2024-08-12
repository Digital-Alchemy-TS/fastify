import {
  BootstrapException,
  TBlackHole,
  TServiceParams,
} from "@digital-alchemy/core";
import { FastifyInstance } from "fastify";

type RoutesCallback = (server: FastifyInstance) => TBlackHole;
export function Routes({
  fastify,
  lifecycle,
  internal,
  context,
}: TServiceParams) {
  return function (callback: RoutesCallback) {
    // way too late
    if (internal.boot.completedLifecycleEvents.has("Ready")) {
      throw new BootstrapException(
        context,
        "BAD_BIND_ORDER",
        "Must call fastify.routes prior to onReady",
      );
    }
    // is a library, or app with bootLibrariesFirst: false
    if (!internal.boot.completedLifecycleEvents.has("Bootstrap")) {
      lifecycle.onBootstrap(
        async () => await callback(fastify.bindings.httpServer),
      );
      return;
    }
    // is probably an app with bootLibrariesFirst: true
    callback(fastify.bindings.httpServer);
  };
}
