import { Breadcrumb, Button, Container } from 'solid-bootstrap';

import FormField from '../components/form-field';
import createForm from '../signals/create-form';

import classes from './new-queue.module.scss';

const NewQueue = () => {
  const { handleSubmit, register } = createForm({
    onSubmit: async (data) => {
      console.log(JSON.stringify(data));
    },
    defaultData: {
      name: undefined,
      maxParallelTasks: 10,
      maxTasksPerSecond: 5,
      minBackoff: 0.5,
      maxBackoff: 3600,
      maxRetries: 100,
    },
  });

  return (
    <div class={classes.container}>
      <Breadcrumb>
        <Breadcrumb.Item href='#'>Queues</Breadcrumb.Item>
        <Breadcrumb.Item
          active
          href='https://getbootstrap.com/docs/4.0/components/breadcrumb/'
        >
          New
        </Breadcrumb.Item>
      </Breadcrumb>

      <form onSubmit={handleSubmit}>
        <FormField
          {...register('name')}
          required
          placeholder='example-queue'
          label='Name of the new queue'
        />

        <FormField
          {...register('maxParallelTasks')}
          required
          type='number'
          placeholder='10'
          label='Maximum number of tasks that can be dispatched in parallel'
        />

        <FormField
          {...register('maxTasksPerSecond')}
          required
          type='number'
          placeholder='5'
          label='Maximum number of tasks that can be dispatched in second'
        />

        <FormField
          {...register('minBackoff')}
          required
          type='number'
          step={0.1}
          placeholder='0.5'
          label='Minimum backoff after failed request in seconds'
        />

        <FormField
          {...register('maxBackoff')}
          required
          type='number'
          placeholder='3600'
          label='Minimum backoff after failed request in seconds'
        />

        <FormField
          {...register('maxRetries')}
          required
          type='number'
          placeholder='100'
          label='Maximum number of retries'
        />

        <Container fluid class='d-flex justify-content-around'>
          <Button type='submit' variant='success'>
            Create queue
          </Button>
        </Container>
      </form>
    </div>
  );
};

export default NewQueue;
