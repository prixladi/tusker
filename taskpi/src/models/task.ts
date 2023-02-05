import { ObjectId } from "@mongo/mod.ts";

import { database } from "~/db/mod.ts";

export type Task = {
  _id: ObjectId;
  url: string;
  queueName: string;

  retries: number;
  scheduledAt: Date;

  deleted?: boolean;
  createdAt: Date;
};

export const Task = database.collection<Task>("tasks");
