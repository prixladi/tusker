import { createResource, createSignal } from 'solid-js';
import apiClient, { QueueList } from './client';

type SearchAndPagination = {
  search?: string;
  skip: number;
  limit: number;
};

const getQueues = async (query: SearchAndPagination) => {
  const response = await apiClient.get<QueueList>('queues', { params: query });
  return response.data;
};

const createGetQueues = (def: SearchAndPagination = { skip: 0, limit: 20 }) => {
  const [query, setQuery] = createSignal(def);

  const [queueList] = createResource(query, getQueues);

  return { queueList, query, setQuery };
};

export default createGetQueues;
