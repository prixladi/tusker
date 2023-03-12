import { useNavigate, useParams } from '@solidjs/router';
import { createEffect, Show } from 'solid-js';

import SEO from '../../components/atoms/seo';
import Breadcrumb from '../../components/molecules/breadcrumb';
import QueueForm from '../../components/templates/queue-form';

import { editQueue } from '../../api/calls';
import createGetQueue from '../../api/create-get-queue';

import classes from './edit-queue.module.scss';

const EditQueue = () => {
  const params = useParams<{ name: string }>();
  const navigate = useNavigate();
  const queue = createGetQueue(params.name);

  createEffect(() => {
    if (queue()?.status === 'not_found') navigate('/queues');
  });

  return (
    <>
      <SEO title={`${params.name} - edit`} />
      <div class={classes.container}>
        <Breadcrumb
          items={[
            { name: 'queues', path: '/queues', isLink: true },
            { name: 'queue', path: `/queues/${params.name}`, isLink: true },
            {
              name: 'edit',
              path: `/queues/${params.name}/edit`,
              isLink: false,
            },
          ]}
        />

        <Show when={queue()}>
          <QueueForm
            edit={true}
            data={queue()?.data}
            onSubmit={async ({ id, ...data }, { setError }) => {
              try {
                const result = await editQueue(id, data);

                if (result.status === 'server_error') {
                  setError('id', 'error occurred on server, try again later');
                } else {
                  navigate(`/queues/${id}`);
                }
              } catch (err) {
                setError('id', 'error occurred on server, try again later');
                throw err;
              }
            }}
          />
        </Show>
      </div>
    </>
  );
};

export default EditQueue;
