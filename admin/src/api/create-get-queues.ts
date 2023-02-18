import { createEffect, createResource, createSignal } from 'solid-js';

import { getQueues, SearchAndPaginationModel } from './calls';

import debounce from 'debounce';
import { QueueList } from './client';

const createGetQueues = (
  def: SearchAndPaginationModel = { skip: 0, limit: 20 }
) => {
  const [query, setQuery] = createSignal(def);

  const fn = async (query: SearchAndPaginationModel) => {
    const res = await getQueues(query);
    if (res) setQueueList(res);
  };
  const debouncedFn = debounce(fn, 300);

  const [queueList, setQueueList] = createSignal(null as QueueList | null);

  let first = true;

  createEffect(async () => {
    await (first ? fn(query()) : debouncedFn(query()));
    first = false;
  });

  return { queueList, query, setQuery };
};

export default createGetQueues;
