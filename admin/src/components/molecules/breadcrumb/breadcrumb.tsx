import { Component, For } from 'solid-js';

import classes from './breadcrumb.module.scss';
import clsx from 'clsx';

type Props = {
  items: {
    name: string;
    path: string;
    isLink: boolean;
  }[];
};

const Breadcrumb: Component<Props> = ({ items }) => (
  <div class={classes.container}>
    <For each={items}>
      {({ name, path, isLink }, i) => {
        const isLast = i() >= items.length - 1;

        return (
          <>
            {isLink ? (
              <a href={path} class={clsx(classes.item, classes.link)}>
                {name}
              </a>
            ) : (
              <span class={classes.item}>{name}</span>
            )}
            {!isLast && <span class={classes.divider}>/</span>}
          </>
        );
      }}
    </For>
  </div>
);

export default Breadcrumb;
