import { is, TServiceParams } from "@digital-alchemy/core";
import { FastifyReply, FastifyRequest } from "fastify";

import { HTTP_REJECTED_AUTH, HttpStatusCode } from "../helpers";

export function Auth({ logger, lifecycle, config }: TServiceParams) {
  lifecycle.onReady(() => {
    if (!is.empty(config.fastify.ADMIN_KEY)) {
      logger.info(`server ADMIN_KEY defined`);
    }
  });

  async function AdminKey(request: FastifyRequest, reply: FastifyReply) {
    if (is.empty(config.fastify.ADMIN_KEY)) {
      logger.warn(`request was configured for ADMIN_KEY auth, but no ADMIN_KEY configured`);
      return;
    }
    if (request.headers["x-admin-key"] === config.fastify.ADMIN_KEY) {
      return;
    }
    logger.warn(`unauthorized`);
    reply.code(HttpStatusCode.UNAUTHORIZED).send({ error: "Unauthorized" });
    HTTP_REJECTED_AUTH.labels("ADMIN_KEY").inc();
  }

  return {
    AdminKey,
  };
}
