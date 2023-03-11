import { Middleware } from "@oak/middleware.ts";
import { Context } from "@oak/context.ts";
import { getQuery } from "@oak/helpers.ts";
import { RouterContext } from "@oak/router.ts";

import { z } from "@zod/mod.ts";

const contextObjects = Object.freeze(["params", "query", "body"] as const);
type ContextObject = typeof contextObjects[number];

type ValidationSchema = {
  body?: z.ZodObject<z.ZodRawShape, "strict">;
  query?: z.ZodObject<z.ZodRawShape, "strict">;
  params?: z.ZodObject<z.ZodRawShape, "strict">;
};

const getRequestObject = async (ctx: Context, prop: ContextObject) => {
  if (prop === "body") {
    return await ctx.request.body().value;
  }
  if (prop === "query") {
    return getQuery(ctx);
  }
  if (prop === "params") {
    const routerContext = ctx as RouterContext<string>;
    return routerContext.params;
  }
};

const setRequestObject = <T>(ctx: Context, prop: ContextObject, data: T) => {
  if (prop === "query") {
    ctx.state.query = data;
  }
};

const factoryValidationMiddleware =
  (schema: ValidationSchema): Middleware => async (ctx, next) => {
    for (const prop of contextObjects) {
      const part = schema[prop];

      if (part) {
        const result = part.safeParse(await getRequestObject(ctx, prop));

        if (result.success) {
          setRequestObject(ctx, prop, result.data);
          continue;
        }

        ctx.response.status = 400;
        ctx.response.body = {
          body: result.error,
        };

        return;
      }
    }

    return await next();
  };

export default factoryValidationMiddleware;
