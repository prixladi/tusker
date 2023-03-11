import { Router } from '@oak/router.ts';
import { z } from '@zod/mod.ts';
import moment from '@moment/mod.ts';

import validate from '~/middleware/validation-middleware.ts';
import { Queue } from '~/models/queue.ts';
import { Task } from '~/models/task.ts';

const router = new Router();

const schema = {
  params: z
    .object({
      id: z.string(),
    })
    .strict(),
};

type Params = z.infer<typeof schema.params>;

router.delete<Params>('/:id', validate(schema), async (ctx) => {
  const now = moment.utc();
  const newQueueName = `${ctx.params.id}-deleted-${now.toDate()}`;
  const { matchedCount } = await Queue.updateOne(
    {
      _id: ctx.params.id,
      deleted: { $ne: true },
    },
    {
      _id: newQueueName,
      deleted: true,
      updatedAt: now.toDate(),
    }
  );

  if (!matchedCount) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Queue with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  await Task.updateMany({ queueId: ctx.params.id }, { queueId: newQueueName });

  ctx.response.status = 204;
});

export default router;
