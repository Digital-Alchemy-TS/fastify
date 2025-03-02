import { AsyncLogData, is, TServiceParams } from "@digital-alchemy/core";
import { FastifyInstance, FastifyRequest } from "fastify";

import { RequestLocals, ResponseHeaders } from "../types/index.mts";

const REQUIRED_HEADERS = new Set<string>();
const PRECISION = 2

export function HttpHooks({
  logger,
  als,
  context,
  http,
}: TServiceParams) {
   function perf () {
    const start = performance.now();
    return function () {
      return Number(Number(
        performance.now() - start,
      ).toFixed(PRECISION));
    };
  };

  async function gatherLocals(req: FastifyRequest): Promise<RequestLocals> {
    logger.trace({ name: gatherLocals }, "gathering data");
    const trace: Partial<Record<string, string>> = {};
    // * track down expected headers + ensure presence
    // Object.values(RequestHeaders).forEach(i => {
    //   const value = req.headers[i];
    //   if (REQUIRED_HEADERS.has(i) && is.undefined(value)) {
    //     throw new BadRequestError(context, `Missing expected header: ${i}`);
    //   }
    //   if (is.undefined(value)) {
    //     return;
    //   }
    //   trace[i] = value.toString();
    // });

    return {
      perf: perf(),
      trace,
    };
  }

  async function setup(fastify: FastifyInstance) {

    fastify.addHook("onRoute", function onRoute(route) {
      // * during startup, identify routes
      logger.debug({ name: onRoute }, "[%s] {%s}", route.method, route.url);
    });

    fastify.addHook("onRequest", async (req, res) => {
      // * merge request data into storage
      const http = await gatherLocals(req);
      const storage = als.getStore();
      if (storage) {
        res.header(ResponseHeaders.requestId, storage.logs.requestId);
        storage.http = http;

        // * extract keys that are supposed to be in logs and append there also
        const keys: string[] = [];
        // Object.keys(http.trace).forEach(i => {
        //   const key = ALS_HEADER_LOGS.get(i);
        //   if (key && key !== "logger") {
        //     // @ts-expect-error unclear typing causing this
        //     // future fixme issue, requires changes internal to framework. logic works as expected, the affected keys are dealt with explicitly elsewhere
        //     storage.logs[key] = http.trace[i];
        //     keys.push(key);
        //   }
        // });

        // * confirm keys
        logger.debug({ keys }, "onRequest");
      }
    });

    fastify.addHook("onResponse", async function postRequest(req, res) {
      // * end of request stats
      // For valid requests, extract method / url from the controller route
      // This will be in the format of `/path/with/:params`, obfuscating the specific values that were actually sent
      //
      // For 404 statusCode, this information won't be available.
      // The actual method / url used will be listed instead
      //
      const config = req.routeOptions.config;
      logger.debug(
        {
          code: res.statusCode,
          method: config?.method || req.method,
          ms: res.elapsedTime,
          name: postRequest,
          url: config?.url || req.url,
        },
        "onResponse",
      );
    });
  }

  return { setup };
}
