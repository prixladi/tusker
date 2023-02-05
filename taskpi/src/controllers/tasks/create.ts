import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";
import moment from "@moment/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Queue } from "~/models/queue.ts";
import { Task } from "~/models/task.ts";

const router = new Router();

const schema = {
  body: z
    .object({
      url: z.string().url(),
      queueName: z.string(),
      delayInSeconds: z.number().positive().optional().default(0),
    })
    .strict(),
};

type Body = z.infer<typeof schema.body>;

router.post("/", validate(schema), async (ctx) => {
  const { delayInSeconds, ...task } = (await ctx.request.body().value) as Body;

  const queue = await Queue.findOne({ name: task.queueName });
  if (!queue) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: `Queue with name '${task.queueName}' does not exist.`,
    };
    return;
  }

  const now = moment.utc();
  const createdAt = now.toDate();
  const scheduledAt = delayInSeconds
    ? now.add(delayInSeconds, "seconds").toDate()
    : now.toDate();

  const id = await Task.insertOne({
    ...task,
    retries: 0,
    scheduledAt,
    createdAt,
  });

  ctx.response.status = 200;
  ctx.response.body = {
    id,
    ...task,
    queueName: queue.name,
  };
});

export default router;
