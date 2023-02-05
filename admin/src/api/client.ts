import axios from 'axios';

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

export type QueueList = {
  data: Queue[];
  count: number;
};

const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });

export default apiClient;
