import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Queue } from "~/models/queue.ts";

const router = new Router();

const schema = {
  body: z
    .object({
      maxParallelTasks: z.number().min(1).max(200).optional().default(1),
      maxTasksPerSecond: z.number().min(1).max(2000).optional().default(1),
      minBackoff: z
        .number()
        .min(0.1)
        .max(60 * 60 * 2)
        .optional()
        .default(1),
      maxBackoff: z
        .number()
        .min(1)
        .max(60 * 60 * 24 * 7)
        .optional()
        .default(60 * 60),
      maxRetries: z.number().min(0).optional().nullable().default(100),
    })
    .strict(),
};

type Body = z.infer<typeof schema.body>;

router.patch("/:name", validate(schema), async (ctx) => {
  const queue = await Queue.findOne({
    _id: ctx.params.name,
  });

  if (!queue) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Queue with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  const body = (await ctx.request.body().value) as Body;

  const updates = {
    ...body,
    updatedAt: new Date(),
  };

  await Queue.updateOne({ name: queue.name }, { $set: updates });

  ctx.response.status = 200;
  ctx.response.body = {
    ...queue,
    ...updates,
  };
});

export default router;
