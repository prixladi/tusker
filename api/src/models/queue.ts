import { database } from "~/db/mod.ts";

export type Queue = {
  _id: string;
  deleted: boolean;
  paused: boolean;

  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;

  createdAt: Date;
  updatedAt?: Date;
};

export const Queue = database.collection<Queue>("queues");
