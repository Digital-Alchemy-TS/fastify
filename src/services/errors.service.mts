import { TServiceParams } from "@digital-alchemy/core";
import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { HttpStatus } from "../index.mts";

export function HttpErrors({ logger }: TServiceParams) {
  function setup(httpServer: FastifyInstance) {
    logger.trace("setup");
    httpServer.setErrorHandler((error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
      reply
        .status(error.statusCode ?? HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR)
        .send({ error: error.message, status_code: error.statusCode });
    });
  }
  return { setup };
}
