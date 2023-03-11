import { useNavigate, useParams } from '@solidjs/router';
import { createEffect } from 'solid-js';

import Breadcrumb from '../../components/molecules/breadcrumb';
import SEO from '../../components/atoms/seo';
import createGetQueue from '../../api/create-get-queue';

import classes from './queue.module.scss';

const Queue = () => {
  const params = useParams<{ name: string }>();
  const navigate = useNavigate();

  const queue = createGetQueue(params.name);

  createEffect(() => {
    if (queue()?.status === 'not_found') navigate('/queues');
  });

  return (
    <>
      <SEO title={`${params.name} - queue`} />
      <div class={classes.container}>
        <Breadcrumb
          items={[
            { name: 'queues', path: '/queues', isLink: true },
            { name: 'queue', path: `/queues/${params.name}`, isLink: false },
            {
              name: 'edit',
              path: `/queues/${params.name}/edit`,
              isLink: true,
            },
          ]}
        />
      </div>
    </>
  );
};

export default Queue;
