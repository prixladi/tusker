import axios from 'axios';

export type SearchAndPaginationModel = {
  search?: string;
  skip: number;
  limit: number;
};

export type QueuePreview = {
  id: string;
  deleted?: boolean;

  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;
  stats: {
    taskCount: number;
  };

  createdAt: Date;
  updatedAt?: Date;
};

export type QueueDetail = {
  id: string;
  deleted?: boolean;

  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;
  stats: {
    taskCount: number;
    taskDoneInLastMinuteCount: number;
    taskExpiredInLastDay: number;
    taskFailedInLastMinuteCount: number;
  };

  createdAt: Date;
  updatedAt?: Date;
};

export type CreateQueueModel = {
  id: string;
  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;
};

export type UpdateQueueModel = {
  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;
};

export type Task = {
  _id: string;
  url: string;
  queueId: string;

  retries: number;
  scheduledAt: Date;

  status: 'active' | 'done' | 'deleted' | 'max-retries';
  
  updatedAt: Date;
  createdAt: Date;
};

export type QueueList = {
  data: QueuePreview[];
  count: number;
};

const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });

export default apiClient;
