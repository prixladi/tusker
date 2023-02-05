import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Queue } from "~/models/queue.ts";

const router = new Router();

const schema = {
  params: z
    .object({
      name: z.string(),
    })
    .strict(),
};

type Params = z.infer<typeof schema.params>;

router.get<Params>("/:name", validate(schema), async (ctx) => {
  const queue = await Queue.findOne({
    name: ctx.params.name,
  });

  if (!queue) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Queue with name '${ctx.params.name}' does not exist.`,
    };

    return;
  }

  ctx.response.status = 200;
  ctx.response.body = queue;
});

export default router;
