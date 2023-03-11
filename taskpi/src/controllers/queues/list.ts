import { Router } from '@oak/router.ts';
import { z } from '@zod/mod.ts';

import validate from '~/middleware/validation-middleware.ts';
import { Queue } from '~/models/queue.ts';
import toResponse from '~/utils/to-response.ts';

const router = new Router();

const schema = {
  query: z
    .object({
      skip: z.coerce.number().min(0).max(Number.MAX_SAFE_INTEGER),
      limit: z.coerce.number().min(1).max(50),
      search: z.string().optional(),
    })
    .strict(),
};

type Query = z.infer<typeof schema.query>;

type ExtendedQueue = Queue & {
  stats: { taskCount: number }[];
};

router.get('/', validate(schema), async (ctx) => {
  const query = ctx.state.query as Query;

  const match = query.search
    ? { _id: new RegExp(`.*${query.search}.*`, 'i'), deleted: { $ne: true } }
    : {};

  const count = await Queue.countDocuments(match);
  const queues = await Queue.aggregate<ExtendedQueue>([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'queueId',
        pipeline: [
          { $match: { status: 'active' } },
          { $group: { _id: null, taskCount: { $sum: 1 } } },
        ],
        as: 'stats',
      },
    },
    {
      $sort: { 'stats.0.taskCount': -1, _id: 1 },
    },
    {
      $skip: query.skip,
    },
    {
      $limit: query.limit,
    },
  ]).toArray();

  ctx.response.status = 200;
  ctx.response.body = {
    data: queues.map(({ stats, ...queue }) => ({
      ...toResponse(queue),
      stats: stats?.length ? stats[0] : { taskCount: 0 },
    })),
    count: count,
  };
});

export default router;
