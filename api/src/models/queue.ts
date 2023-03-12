import { database } from '~/db/mod.ts';

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

type QueueStatic = ReturnType<typeof database.collection<Queue>> & {
  ensureIndexes: (background?: boolean) => Promise<void>;
};

const Queue = database.collection<Queue>('queues') as QueueStatic;

export const ensureIndexes = async (background = true) => {
  await Queue.createIndexes({
    indexes: [
      {
        key: { deleted: 1 },
        name: 'deleted_1',
        background,
      },
    ],
  });
};

Queue.ensureIndexes = ensureIndexes;

export { Queue };
