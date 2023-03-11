import apiClient, {
  CreateQueueModel,
  QueueDetail,
  QueueList,
  SearchAndPaginationModel,
  UpdateQueueModel,
} from './client';

export const getQueues = async (query: SearchAndPaginationModel) => {
  const response = await apiClient.get<QueueList>('queues', { params: query });
  return response.data;
};

export const getQueue = async (name: string) => {
  const response = await apiClient.get<QueueDetail>(`queues/${name}`, {
    validateStatus: null,
  });

  if (response.status >= 200 && response.status <= 299) {
    return {
      status: 'ok',
      data: response.data,
    } as const;
  }

  if (response.status === 404) {
    return { status: 'not_found' } as const;
  }

  return { status: 'server_error' } as const;
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
    return { status: 'conflict' } as const;
  }

  return { status: 'server_error' } as const;
};

export const editQueue = async (name: string, model: UpdateQueueModel) => {
  const response = await apiClient.patch<QueueList>(`queues/${name}`, model, {
    validateStatus: null,
  });

  if (response.status >= 200 && response.status <= 299) {
    return {
      status: 'ok',
      data: response.data,
    } as const;
  }

  return { status: 'server_error' } as const;
};
