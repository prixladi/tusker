import { Router } from "@oak/router.ts";
import { z } from "@zod/mod.ts";
import { ObjectId } from "@mongo/mod.ts";

import validate from "~/middleware/validation-middleware.ts";
import { Task } from "~/models/task.ts";
import toResponse from "~/utils/to-response.ts";

const router = new Router();

const schema = {
  params: z.object({
    id: z.string(),
  }).strict(),
};

type Params = z.infer<typeof schema.params>;

router.get<Params>("/:id", validate(schema), async (ctx) => {
  const task = await Task.findOne({
    _id: new ObjectId(ctx.params.id),
    status: { $ne: "deleted" },
  });

  if (!task) {
    ctx.response.status = 404;
    ctx.response.body = {
      message: `Task with id '${ctx.params.id}' does not exist.`,
    };

    return;
  }

  ctx.response.status = 200;
  ctx.response.body = toResponse(task);
});

export default router;
