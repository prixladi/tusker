import { Application } from "@oak/application.ts";
import { oakCors } from "@cors/mod.ts";
import * as log from "@log/mod.ts";
import moment from "@moment/mod.ts";

import config from "~/config/mod.ts";

import router from "./controllers/mod.ts";

const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  log.info(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port} - ${moment.utc().format("yyyyMMDDTmm:ss")}`,
  );
});

app.listen({ port: config.port });
