import { useNavigate } from '@solidjs/router';

import SEO from '../../components/atoms/seo';
import Breadcrumb from '../../components/molecules/breadcrumb';
import QueueForm from '../../components/templates/queue-form';

import { createQueue } from '../../api/calls';

import classes from './new-queue.module.scss';

const NewQueue = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO title='Create new queue' />
      <div class={classes.container}>
        <Breadcrumb
          items={[
            { name: 'queues', path: '/queues', isLink: true },
            { name: 'new', path: '/queues/_/new', isLink: false },
          ]}
        />

        <QueueForm
          onSubmit={async (data, { setError }) => {
            try {
              const result = await createQueue(data);

              if (result.status === 'conflict') {
                setError('id', 'queue with provided name already exist');
              } else if (result.status === 'server_error') {
                setError('id', 'error occurred on server, try again later');
              } else {
                navigate(`/queues/${data.id}`);
              }
            } catch (err) {
              setError('id', 'error occurred on server, try again later');
              throw err;
            }
          }}
        />
      </div>
    </>
  );
};

export default NewQueue;
