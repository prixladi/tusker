import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";
import moment from "@moment/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Queue } from "~/models/queue.ts";
import toResponse from "~/utils/to-response.ts";
import { Task } from "~/models/task.ts";

const router = new Router();

const schema = {
  params: z
    .object({
      id: z.string(),
    })
    .strict(),
};

type Params = z.infer<typeof schema.params>;

router.get<Params>("/:id", validate(schema), async (ctx) => {
  const queue = await Queue.findOne({
    _id: ctx.params.id,
    deleted: { $ne: true },
  });

  if (!queue) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Queue with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  const date = moment.utc().subtract(1, "minute");

  const [
    count,
    doneInLastMinuteCount,
    failedInLastMinuteCount,
    expiredInLastDay,
  ] = await Promise.all([
    Task.countDocuments({ status: "active" }),
    Task.countDocuments({
      status: "done",
      updatedAt: { $gt: date.toDate() },
    }),
    Task.countDocuments({
      status: "active",
      updatedAt: { $gt: date.toDate() },
      retries: { $gt: 0 },
    }),
    Task.countDocuments({
      status: "max-retries",
      updatedAt: { $gt: date.subtract(1, "day").toDate() },
    }),
  ]);

  ctx.response.status = 200;
  ctx.response.body = {
    ...toResponse(queue),
    stats: {
      taskCount: count,
      taskDoneInLastMinuteCount: doneInLastMinuteCount,
      taskFailedInLastMinuteCount: failedInLastMinuteCount,
      taskExpiredInLastDay: expiredInLastDay,
    },
  };
});

export default router;
