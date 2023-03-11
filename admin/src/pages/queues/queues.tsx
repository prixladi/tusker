import clsx from 'clsx';
import { createMemo, For } from 'solid-js';

import createGetQueues from '../../api/create-get-queues';

import FormField from '../../components/atoms/form-field';
import SEO from '../../components/atoms/seo';
import Breadcrumb from '../../components/molecules/breadcrumb';
import SearchButton from '../../components/molecules/search-button';

import classes from './queues.module.scss';

const Queues = () => {
  const { queueList, setQuery, query } = createGetQueues();

  const inputField = createMemo(() => ({
    name: 'search',
    value: query().search,
    onInput: (e: InputEvent) => {
      setQuery((query) => ({
        ...query,
        search: (e.currentTarget as any).value,
      }));
    },
  }));

  return (
    <>
      <SEO title='Queues' />
      <div class={classes.container}>
        <Breadcrumb
          items={[
            { name: 'queues', path: '/queues', isLink: false },
            { name: 'new', path: '/queues/_/new', isLink: true },
          ]}
        />

        <div class={classes.content}>
          <div class={classes.searchBar}>
            <FormField
              field={inputField}
              required
              placeholder='Type to search in queues'
              groupClass={classes.searchGroup}
              class={classes.searchInput}
            />
            <SearchButton />
          </div>

          <div class={classes.table}>
            <div class={clsx(classes.row, classes.header)}>
              <div class={clsx(classes.item, classes.headerName)}>
                Queue name
              </div>
              <div class={clsx(classes.item, classes.headerTaskCount)}>
                Tasks
              </div>
              <div class={clsx(classes.item, classes.headerMaxTasksPerSecond)}>
                Max per second
              </div>
              <div class={clsx(classes.item, classes.headerMaxParallelTasks)}>
                Max parallel
              </div>
            </div>
            <For each={queueList()?.data}>
              {(queue) => (
                <div class={classes.row}>
                  <a
                    href={`/queues/${queue.id}`}
                    class={clsx(classes.item, classes.name)}
                  >
                    {queue.id}
                  </a>
                  <div class={clsx(classes.item, classes.taskCount)}>
                    {queue.stats.taskCount}
                  </div>
                  <div class={clsx(classes.item, classes.maxTasksPerSecond)}>
                    {queue.maxTasksPerSecond}
                  </div>
                  <div class={clsx(classes.item, classes.maxParallelTasks)}>
                    {queue.maxParallelTasks}
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </>
  );
};

export default Queues;
