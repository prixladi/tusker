import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";

import { Queue } from "~/models/queue.ts";
import { Task } from "~/models/task.ts";
import toResponse from "~/utils/to-response.ts";

const router = new Router();

const schema = {
  query: z
    .object({
      skip: z.number().min(0).max(Number.MAX_SAFE_INTEGER),
      limit: z.number().min(1).max(50),
    })
    .strict(),
  params: z
    .object({
      id: z.string(),
    })
    .strict(),
};

type Params = z.infer<typeof schema.params>;

type Query = z.infer<typeof schema.query>;

router.get<Params>("/:id/tasks", async (ctx) => {
  const queue = await Queue.findOne({
    _id: ctx.params.id,
  });

  if (!queue) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Queue with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  const query = ctx.state.query as Query;

  const match = { queueId: queue._id, active: true };

  const count = await Task.countDocuments(match);
  const tasks = await Task.aggregate<Task>([
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
    data: tasks.map(toResponse),
    count: count,
  };
});

export default router;
