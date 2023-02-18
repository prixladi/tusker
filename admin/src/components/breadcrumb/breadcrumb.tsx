import { Component, createMemo, For } from 'solid-js';

import { useLocation } from '@solidjs/router';

import classes from './breadcrumb.module.scss';
import clsx from 'clsx';

type Props = {
  additionalItems?: {
    name: string;
    path: string;
    isLink: boolean;
  }[];
};

const Breadcrumb: Component<Props> = ({ additionalItems }) => {
  const location = useLocation();

  const parts = createMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    function* gen() {
      let path = '/';
      for (let [i, part] of Object.entries(pathParts)) {
        path += `${part}/`;
        if (part === '_') continue;
        yield { path, name: part, isLink: Number(i) < pathParts.length - 1 };
      }
    }

    const parts = Array.from(gen());
    return additionalItems ? [...parts, ...additionalItems] : parts;
  });

  return (
    <div class={classes.container}>
      <For each={parts()}>
        {({ name, path, isLink }, i) => {
          const isLast = i() >= parts().length - 1;
          
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
};

export default Breadcrumb;
