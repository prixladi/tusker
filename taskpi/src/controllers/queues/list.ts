import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Queue } from "~/models/queue.ts";

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

router.get("/", validate(schema), async (ctx) => {
  const query = ctx.state.query as Query;

  const match = query.search ? { queueName: /query.search/i } : {};

  const count = await Queue.countDocuments(match);
  const queues = await Queue.aggregate<Queue>([
    {
      $match: match,
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
    data: queues,
    count: count,
  };
});

export default router;
