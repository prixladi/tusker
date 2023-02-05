import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Queue } from "~/models/queue.ts";

const router = new Router();

const schema = {
  body: z
    .object({
      name: z.string().min(5),
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

router.post("/", validate(schema), async (ctx) => {
  const queue = (await ctx.request.body().value) as Body;

  const exists = await Queue.findOne({ name: queue.name });
  if (exists) {
    ctx.response.status = 409;
    ctx.response.body = {
      message: `Queue with name '${queue.name}' already exist.`,
    };
    return;
  }

  await Queue.insertOne({ ...queue, createdAt: new Date() });

  ctx.response.status = 200;
  ctx.response.body = queue;
});

export default router;
