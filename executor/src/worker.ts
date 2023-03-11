import moment from "@moment/mod.ts";
import { pLimit } from "@pLimit/mod.ts";
import * as log from "@log/mod.ts";

import { Queue } from "~/models/queue.ts";
import { Task } from "~/models/task.ts";

import { delay } from "~/utils/delay.ts";

import config from "~/config/mod.ts";

class StatusCodeError extends Error {
  code: number;

  constructor(code: number) {
    super();
    this.code = code;
  }
}

for (let i = 0; i < 10; i++) {
  await Task.insertOne({
    queueId: config.queueName || "",
    url: "https://webhook.site/935a17e3-44d9-4d57-a15f-686d8ab7ec1c",
    retries: 0,
    scheduledAt: new Date(),
    status: "active",
    method: "PATCH",
    body: { aaa: "bbb" },
    headers: { "x-speck": "100" },
    updatedAt: new Date(),
    createdAt: new Date(),
  });
}

const queueGetter = async (queueName: string, interval = 5_000) => {
  let queue = await Queue.findOne({ _id: queueName });

  setInterval(async () => {
    queue = await Queue.findOne({ _id: queueName });
  }, interval);

  return () => queue;
};

const getNextSchedule = (task: Task, queue: Queue) => {
  const now = moment.utc();
  return now
    .add(
      Math.min(
        queue.maxBackoff,
        queue.minBackoff * Math.pow(2, task.retries + 1),
      ),
      "seconds",
    )
    .toDate();
};

const m = (message: string) =>
  `[${config.queueName}] ${message} - ${moment.utc().format("yyyyMMDDTmm:ss")}`;

const executeTask = async (task: Task, queue: Queue) => {
  try {
    const response = await fetch(task.url, {
      method: task.method,
      body: task.body ? JSON.stringify(task.body) : undefined,
      headers: {
        "user-agent": `task-queue ${queue._id}`,
        ...task.headers,
      },
    });

    if (response.status > 299 || response.status < 200) {
      throw new StatusCodeError(response.status);
    }

    const now = moment.utc();
    await Task.updateOne(
      { _id: task._id },
      {
        $set: {
          status: "done",
          updatedAt: now.toDate(),
          latestStatusCode: response.status,
        },
      },
    );
  } catch (err) {
    const statusCode = err instanceof StatusCodeError ? err.code : 500;

    const now = moment.utc();
    const maxRetries = queue.maxRetries && task.retries + 1 >= queue.maxRetries;

    await Task.updateOne(
      { _id: task._id, status: { $ne: "deleted" } },
      {
        $set: {
          status: maxRetries ? "max-retries" : "active",
          retries: task.retries + 1,
          scheduledAt: getNextSchedule(task, queue),
          updatedAt: now.toDate(),
          latestStatusCode: statusCode,
        },
      },
    );
  }
};

const execute = async (queueName: string) => {
  const getQueue = await queueGetter(queueName);
  let queue = getQueue();

  if (!queue) return "NOT_FOUND";
  if (queue.deleted) return "OK";

  const limit = pLimit(Math.max(1, queue.maxParallelTasks));

  let running = 0;
  while (queue && !queue.deleted) {
    queue = getQueue();
    if (!queue) continue;

    if (queue.paused) {
      log.info(m("Queue is paused skipping execution loop"));
      await delay(5000);
      continue;
    }

    if (running >= queue.maxTasksPerSecond) {
      log.info(m("Execution queue is full skipping execution loop"));
      await delay(1000);
      continue;
    }

    const take = queue.maxTasksPerSecond - running;

    const now = moment.utc();
    const tasksToRun = await Task.find({
      queueId: queueName,
      scheduledAt: { $lte: now.toDate() },
      status: "active",
    })
      .limit(take)
      .toArray();

    if (!tasksToRun.length) {
      log.info(m("No task to execute skipping execution loop"));
      await delay(1000);
      continue;
    }

    log.info(m(`Executing '${tasksToRun.length}' new tasks`));
    await Task.updateMany(
      { _id: { $in: tasksToRun.map(({ _id }) => _id) } },
      { $set: { status: "running" } },
    );

    tasksToRun.forEach((task) => {
      running++;
      limit(async () => {
        try {
          queue && (await executeTask(task, queue));
        } finally {
          running--;
        }
      });
    });

    await delay(1000);
  }
  limit.clearQueue();

  if (!queue) return "NOT_FOUND";
  if (queue.deleted) return "OK";
};

if (!config.queueName) {
  log.error(m("Queue name was not provided exiting worker"));
  Deno.exit(1);
} else {
  log.info(m("Starting execution"));
  const result = await execute(config.queueName);

  if (result === "NOT_FOUND") {
    log.error(m("Queue was not found exiting worker"));
    Deno.exit(2);
  } else {
    log.info(m("Queue was flagged as deleted exiting worker"));
    Deno.exit(0);
  }
}
