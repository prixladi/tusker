import { Router } from "@oak/router.ts";

import createRouter from "./create.ts";
import getRouter from "./get.ts";
import deleteRouter from "./delete.ts";

const router = new Router({ prefix: "/tasks" });

router.use(createRouter.routes());
router.use(getRouter.routes());
router.use(deleteRouter.routes());

router.use(createRouter.allowedMethods());
router.use(getRouter.allowedMethods());
router.use(deleteRouter.allowedMethods());

export default router;
