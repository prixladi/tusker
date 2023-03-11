import { Router } from "@oak/router.ts";

import queuesRouter from "./queues/mod.ts";
import tasksRouter from "./tasks/mod.ts";

const router = new Router({ prefix: "/api" });

router.use(queuesRouter.routes());
router.use(tasksRouter.routes());

router.use(queuesRouter.allowedMethods());
router.use(tasksRouter.allowedMethods());

export default router;
