import { Router } from '@oak/router.ts';
import { z } from '@zod/mod.ts';
import moment from '@moment/mod.ts';

import validate from '~/middleware/validation-middleware.ts';
import { Queue } from '~/models/queue.ts';

const router = new Router();

const schema = {
  body: z
    .object({
      id: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .min(5)
        .max(35),
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

router.post('/', validate(schema), async (ctx) => {
  const { id: _id, ...queue } = (await ctx.request.body().value) as Body;

  const upsertBody = {
    ...queue,
    deleted: false,
    paused: false,
    _id,
    createdAt: moment.utc().toDate(),
  };

  const existing = await Queue.findOne({ _id });
  if (existing) {
    if (!existing.deleted) {
      ctx.response.status = 409;
      ctx.response.body = {
        message: `Queue with id '${_id}' already exist.`,
      };
      return;
    }

    await Queue.updateOne({ _id }, upsertBody);
  } else {
    await Queue.insertOne(upsertBody);
  }

  ctx.response.status = 200;
  ctx.response.body = upsertBody;
});

export default router;
