import { Application } from "@oak/application.ts";
import { oakCors } from "@cors/mod.ts";

import router from "./controllers/mod.ts";

const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`,
  );
});

app.listen({ port: 8000 });
