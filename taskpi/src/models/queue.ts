import { database } from "~/db/mod.ts";

export type Queue = {
  name: string;
  deleted?: boolean;

  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;

  createdAt: Date;
  updatedAt?: Date;
};

export const Queue = database.collection<Queue>("queues");
