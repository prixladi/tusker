import { createResource } from 'solid-js';

import { getQueue } from './calls';

const createGetQueue = (id: string) => {
  const [result] = createResource(id, getQueue);
  return result;
};

export default createGetQueue;
