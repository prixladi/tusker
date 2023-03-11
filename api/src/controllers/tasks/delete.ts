import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";
import { ObjectId } from "@mongo/mod.ts";
import moment from "@moment/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
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

router.delete<Params>("/:id", validate(schema), async (ctx) => {
  const now = moment.utc();

  const { matchedCount } = await Task.updateOne(
    {
      _id: new ObjectId(ctx.params.id),
      status: { $ne: "deleted" },
    },
    { status: "deleted", updatedAt: now.toDate() },
  );

  if (!matchedCount) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Task with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  ctx.response.status = 204;
});

export default router;
