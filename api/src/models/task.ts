import { ObjectId } from "@mongo/mod.ts";

import { database } from "~/db/mod.ts";
import { HttpMethod } from "~/utils/http-methods.ts";

export type Task = {
  _id: ObjectId;
  queueId: string;

  retries: number;
  scheduledAt: Date;

  status: "active" | "done" | "deleted" | "max-retries";

  url: string;
  method: HttpMethod;
  // deno-lint-ignore no-explicit-any
  body: Record<string, any>;
  headers: Record<string, string>;

  updatedAt: Date;
  createdAt: Date;
};

type TaskStatic = ReturnType<typeof database.collection<Task>> & {
  ensureIndexes: (background?: boolean) => Promise<void>;
};

const Task = database.collection<Task>("tasks") as TaskStatic;

export const ensureIndexes = async (background = true) => {
  await Task.createIndexes({
    indexes: [
      {
        key: { status: 1 },
        name: 'deleted_1',
        background,
      },
      {
        key: { queueId: 1 },
        name: 'queueId_1',
        background,
      },
      {
        key: { queueId: 1, status: 1 },
        name: 'queueId_1__status_1',
        background,
      },
      {
        key: { queueId: 1, status: 1, scheduledAt: 1 },
        name: 'queueId_1__status_1__scheduledAt_1',
        background,
      },
      {
        key: { queueId: 1, status: 1, updatedAt: 1 },
        name: 'queueId_1__status_1__updatedAt_1',
        background,
      },
      {
        key: { queueId: 1, status: 1, updatedAt: 1, retries: 1 },
        name: 'queueId_1__status_1__updatedAt_1__retries_1',
        background,
      },
    ],
  });
};

Task.ensureIndexes = ensureIndexes;

export {Task};