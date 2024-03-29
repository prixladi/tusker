import { ObjectId } from "@mongo/mod.ts";

import { database } from "~/db/mod.ts";
import { HttpMethod } from "~/utils/http-methods.ts";

export type Task = {
  _id: ObjectId;
  queueId: string;

  retries: number;
  scheduledAt: Date;

  status: "active" | "done" | "deleted" | "max-retries" | "running";

  latestStatusCode?: number;

  url: string;
  method: HttpMethod;
  // deno-lint-ignore no-explicit-any
  body?: Record<string, any>;
  headers?: Record<string, string>;

  updatedAt: Date;
  createdAt: Date;
};

export const Task = database.collection<Task>("tasks");
