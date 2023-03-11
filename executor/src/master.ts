import * as log from "@log/mod.ts";
import moment from "@moment/mod.ts";

import { Queue } from "~/models/queue.ts";

import { delay } from "~/utils/delay.ts";

const executionMap: Record<string, Deno.Process | undefined> = {};

const m = (message: string) =>
  `${message} - ${moment.utc().format("yyyyMMDDTmm:ss")}`;

while (true) {
  const queues = await Queue.find({
    _id: {
      $nin: Object.entries(executionMap)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key),
    },
    deleted: { $ne: true },
  }).toArray();

  for (const queue of queues) {
    if (executionMap[queue._id]) continue;

    log.info(m(`Starting execution of new queue - '${queue._id}'`));
    const process = Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-env",
        "--import-map=import_map.json",
        "./src/worker.ts",
      ],
      env: {
        QUEUE_NAME: queue._id,
      },
    });

    executionMap[queue._id] = process;

    process
      .status()
      .then(({ code }) => {
        if (code) {
          log.error(
            m(
              `Execution of queue - '${queue._id}' ended with status code '${code}'`,
            ),
          );
        } else {
          log.info(m(`Execution of queue - '${queue._id}' ended successfully`));
        }
      })
      .catch(() => {
        log.error(m(`Execution of queue - '${queue._id}' ended with error`));
      })
      .finally(() => {
        executionMap[queue._id] = undefined;
      });
  }

  await delay(5_000);
}
