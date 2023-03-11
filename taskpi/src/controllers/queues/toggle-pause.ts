import { Router } from '@oak/router.ts';
import { z } from '@zod/mod.ts';
import moment from '@moment/mod.ts';

import validate from '~/middleware/validation-middleware.ts';
import { Queue } from '~/models/queue.ts';

const router = new Router();

const schema = {
  params: z
    .object({
      id: z.string(),
    })
    .strict(),
  body: z
    .object({
      paused: z.boolean(),
    })
    .strict(),
};

type Params = z.infer<typeof schema.params>;
type Body = z.infer<typeof schema.body>;

router.put<Params>('/:id/paused', validate(schema), async (ctx) => {
  const body = (await ctx.request.body().value) as Body;

  const { matchedCount } = await Queue.updateOne(
    {
      _id: ctx.params.id,
      deleted: { $ne: true },
    },
    { paused: body.paused, updatedAt: moment.utc().toDate() }
  );

  if (!matchedCount) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Queue with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  ctx.response.status = 204;
});

export default router;
