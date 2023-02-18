import joi from 'joi';
import { Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import FormField from '../../components/form-field/form-field';
import Button from '../../components/button';
import Breadcrumb from '../../components/breadcrumb';
import SEO from '../../components/seo';

import createForm from '../../signals/create-form';

import { createQueue } from '../../api/calls';

import classes from './new-queue.module.scss';

const schema = joi.object({
  name: joi
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(5)
    .max(35)
    .required(),
  maxParallelTasks: joi.number().min(1).max(200).optional().default(1),
  maxTasksPerSecond: joi.number().min(1).max(2000).optional().default(1),
  minBackoff: joi
    .number()
    .min(0.1)
    .max(60 * 60 * 2)
    .optional()
    .default(1),
  maxBackoff: joi
    .number()
    .min(1)
    .max(60 * 60 * 24 * 7)
    .optional()
    .default(60 * 60),
  maxRetries: joi.number().min(0).optional().default(100),
});

const defaultData = {
  name: undefined,
  maxParallelTasks: 10,
  maxTasksPerSecond: 5,
  minBackoff: 0.5,
  maxBackoff: 3600,
  maxRetries: 100,
};

const NewQueue = () => {
  const navigate = useNavigate();

  const { handleSubmit, register, submitting } = createForm({
    onSubmit: async (data, { setError }) => {
      try {
        const result = await createQueue(data);

        if (result.status === 'conflict') {
          setError('name', 'queue with provided name already exist');
        } else if (result.status === 'server_error') {
          setError('name', 'error occurred on server, try again later');
        } else {
          navigate('/queues');
        }
      } catch (err) {
        setError('name', 'error occurred on server, try again later');
        throw err;
      }
    },
    schema,
    defaultData,
  });

  const nameField = register('name');
  const maxParallelTasksField = register('maxParallelTasks');
  const maxTasksPerSecondField = register('maxTasksPerSecond');
  const minBackoffField = register('minBackoff');
  const maxBackoffField = register('maxBackoff');
  const maxRetriesField = register('maxRetries');

  return (
    <>
      <SEO title='Create new queue' />
      <div class={classes.container}>
        <Breadcrumb />

        <div class={classes.card}>
          <form class={classes.form} onSubmit={handleSubmit}>
            <FormField
              field={nameField}
              required
              placeholder='example-queue'
              label='Name of the new queue in lower-kebab-case format'
            />

            <FormField
              field={maxParallelTasksField}
              required
              type='number'
              placeholder='10'
              label='Maximum number of tasks that can be dispatched in parallel'
            />

            <FormField
              field={maxTasksPerSecondField}
              required
              type='number'
              placeholder='5'
              label='Maximum number of tasks that can be dispatched in second'
            />

            <FormField
              field={minBackoffField}
              required
              type='number'
              step={0.1}
              placeholder='0.5'
              label='Minimum backoff after failed request in seconds'
            />

            <FormField
              field={maxBackoffField}
              required
              type='number'
              placeholder='3600'
              label='Maximum backoff after failed request in seconds'
            />

            <FormField
              field={maxRetriesField}
              required
              type='number'
              placeholder='100'
              label='Maximum number of retries'
            />

            <Button class={classes.button} type='submit'>
              <Show when={!submitting()} fallback='Creating queue...'>
                Create queue!
              </Show>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewQueue;
