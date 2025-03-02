import { is, TServiceParams } from "@digital-alchemy/core";

import { FastifyHooks } from "../types/index.mts";

/**
 * Merge together the internal middleware. Intended for usage on a per-route basis
 */
export function HttpMiddleware({ logger }: TServiceParams) {
  return function aggregate(...hooks: FastifyHooks[]) {
    const out: FastifyHooks = {};
    hooks.forEach(i => {
      // @ts-expect-error because TS is dumb
      Object.keys(i).forEach((key: keyof FastifyHooks) => {
        out[key] ??= [];
        const current = out[key];
        if (is.array(current)) {
          if (is.array(i[key])) {
            current.push(...i[key]);
          } else {
            current.push(i[key]);
          }
        }
      });
    });
    return out;
  };
}
