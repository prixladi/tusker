import apiClient, { QueueList } from './client';

export type SearchAndPaginationModel = {
  search?: string;
  skip: number;
  limit: number;
};

export type CreateQueueModel = {
  search?: string;
  skip: number;
  limit: number;
};

export const getQueues = async (query: SearchAndPaginationModel) => {
  const response = await apiClient.get<QueueList>('queues', { params: query });
  return response.data;
};

export const createQueue = async (model: CreateQueueModel) => {
  const response = await apiClient.post<QueueList>('queues', model, {
    validateStatus: null,
  });

  if (response.status >= 200 && response.status <= 299) {
    return {
      status: 'ok',
      data: response.data,
    } as const;
  }

  if (response.status === 409) {
    return {
      status: 'conflict',
    } as const;
  }

  return {
    status: 'server_error',
  } as const;
};
