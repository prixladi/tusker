import { Router } from "@oak/router.ts";

import createRouter from "./create.ts";
import listRouter from "./list.ts";
import getRouter from "./get.ts";
import deleteRouter from "./delete.ts";
import updateRouter from "./update.ts";
import tasksRouter from "./update.ts";

const router = new Router({ prefix: "/queues" });

router.use(createRouter.routes());
router.use(listRouter.routes());
router.use(getRouter.routes());
router.use(deleteRouter.routes());
router.use(updateRouter.routes());
router.use(tasksRouter.routes());

router.use(createRouter.allowedMethods());
router.use(listRouter.allowedMethods());
router.use(getRouter.allowedMethods());
router.use(deleteRouter.allowedMethods());
router.use(updateRouter.allowedMethods());
router.use(tasksRouter.allowedMethods());

export default router;
