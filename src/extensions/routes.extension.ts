import {
  BootstrapException,
  TBlackHole,
  TServiceParams,
} from "@digital-alchemy/core";
import { FastifyInstance } from "fastify";

type RoutesCallback = (server: FastifyInstance) => TBlackHole;
const EARLY = -1000;
export function Routes({
  fastify,
  lifecycle,
  internal,
  context,
}: TServiceParams) {
  return function (callback: RoutesCallback) {
    if (internal.boot.completedLifecycleEvents.has("Ready")) {
      throw new BootstrapException(
        context,
        "BAD_BIND_ORDER",
        "Must call fastify.routes prior to onBootstrap",
      );
    }
    lifecycle.onReady(
      async () => await callback(fastify.bindings.httpServer),
      EARLY,
    );
  };
}
