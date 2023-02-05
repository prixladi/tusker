import { Button } from 'solid-bootstrap';
import { createMutable } from 'solid-js/store';

import createGetQueues from '../api/create-get-queues';

const Dashboard = () => {
  const { queueList } = createGetQueues();

  const data = createMutable({ aa: 'aaa' });

  return (
    <div>
      <Button onClick={() => (data.aa = data.aa + '1')} variant='success'>
        Success
      </Button>
      <input onInput={(e) => console.log((e.target as any).value)} />
      {JSON.stringify(data)}
      <pre>
        <code>{JSON.stringify(queueList())}</code>
      </pre>
    </div>
  );
};

export default Dashboard;
