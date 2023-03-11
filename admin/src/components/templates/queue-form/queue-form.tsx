import { Component, Show } from 'solid-js';
import joi from 'joi';

import createForm, { SubmitUtils } from '../../../signals/create-form';

import FormField from '../../atoms/form-field';
import Button from '../../atoms/button';

import classes from './queue-form.module.scss';

type QueueData = {
  id: string;
  maxParallelTasks: number;
  maxTasksPerSecond: number;
  minBackoff: number;
  maxBackoff: number;
  maxRetries: number | null;
};

type Props = {
  onSubmit: (
    data: QueueData,
    utils: SubmitUtils<QueueData>
  ) => Promise<void> | void;
} & (
  | {
      edit: true;
      data?: QueueData;
    }
  | {
      edit?: false | undefined;
      data?: never;
    }
);

const schema = joi.object({
  id: joi
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

const defaultData: QueueData = {
  id: '',
  maxParallelTasks: 10,
  maxTasksPerSecond: 5,
  minBackoff: 0.5,
  maxBackoff: 3600,
  maxRetries: 100,
};

const pick = ({
  id,
  maxParallelTasks,
  maxTasksPerSecond,
  minBackoff,
  maxBackoff,
  maxRetries,
}: QueueData) => ({
  id,
  maxParallelTasks,
  maxTasksPerSecond,
  minBackoff,
  maxBackoff,
  maxRetries,
});

const QueueForm: Component<Props> = ({ onSubmit, data, edit }) => {
  const { handleSubmit, register, submitting } = createForm<QueueData>({
    onSubmit: onSubmit,
    defaultData: pick(data ?? defaultData),
    schema,
  });

  const idField = register('id');
  const maxParallelTasksField = register('maxParallelTasks');
  const maxTasksPerSecondField = register('maxTasksPerSecond');
  const minBackoffField = register('minBackoff');
  const maxBackoffField = register('maxBackoff');
  const maxRetriesField = register('maxRetries');

  return (
    <div class={classes.card}>
      <form class={classes.form} onSubmit={handleSubmit}>
        <FormField
          field={idField}
          disabled={edit}
          required
          placeholder='example-queue'
          label='Unique name of the new queue in lower-kebab-case format'
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
          <Show
            when={!submitting()}
            fallback={edit ? 'Editing queue...' : 'Creating queue...'}
          >
            {edit ? 'Edit queue!' : 'Create queue!'}
          </Show>
        </Button>
      </form>
    </div>
  );
};

export default QueueForm;
