import { Router } from '@oak/router.ts';
import { z } from '@zod/mod.ts';
import moment from '@moment/mod.ts';

import validate from '~/middleware/validation-middleware.ts';
import { Queue } from '~/models/queue.ts';
import { Task } from '~/models/task.ts';

const router = new Router();

const schema = {
  body: z
    .object({
      url: z.string().url(),
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
      body: z.object({}).passthrough(),
      headers: z.object({}).passthrough(),
      queueId: z.string(),
      delayInSeconds: z.number().positive().optional().default(0),
    })
    .strict(),
};

type Body = z.infer<typeof schema.body>;

router.post('/', validate(schema), async (ctx) => {
  const { delayInSeconds, ...task } = (await ctx.request.body().value) as Body;

  const queue = await Queue.findOne({
    _id: task.queueId,
    deleted: { $ne: true },
  });
  if (!queue) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: `Queue with id '${task.queueId}' does not exist.`,
    };
    return;
  }

  const now = moment.utc();
  const createdAt = now.toDate();
  const scheduledAt = delayInSeconds
    ? now.add(delayInSeconds, 'seconds').toDate()
    : now.toDate();

  const id = await Task.insertOne({
    ...task,
    retries: 0,
    scheduledAt,
    status: 'active',
    updatedAt: createdAt,
    createdAt,
  });

  ctx.response.status = 200;
  ctx.response.body = {
    id,
    ...task,
    queueId: queue._id,
  };
});

export default router;
