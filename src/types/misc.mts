import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type as t } from "@sinclair/typebox";
import {
  FastifyBaseLogger,
  FastifyInstance,
  RouteShorthandOptions,
} from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";


export interface SessionData {
  id?: string;
}

export interface RequestLocals {
  trace: Partial<Record<string, string>>;
  perf: () => number;
}

export const tagRoute =
  (tag: string) =>
  ({ store }: { store: { tag: string } }) => {
    store.tag = tag;
  };

export enum ResponseHeaders {
  requestId = "x-request-id",
}

// export type RouteDetails = Pick<
//   OpenAPIV3.OperationObject,
//   "description" | "summary" | "tags"
// >;

export const CommonHeaders = t.Object({
  "x-correlation-id": t.String(),
});
export type CommonHeaders = typeof CommonHeaders.static;

export type HttpInstance = FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

/**
 * https://fastify.dev/docs/latest/Reference/Lifecycle/
 */
export type FastifyHooks = Pick<
  RouteShorthandOptions,
  | "onRequest"
  // | "preParsing"
  // | "preValidation"
  | "preHandler"
  // | "preSerialization"
  // | "onSend"
  // | "onResponse"
  // | "onTimeout"
  // | "onError"
  // | "onRequestAbort"
>;
