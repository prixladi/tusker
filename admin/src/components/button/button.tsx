import clsx from 'clsx';
import { Component, ParentProps, JSX } from 'solid-js';

import classes from './button.module.scss';

type Props = ParentProps<JSX.ButtonHTMLAttributes<any>>;

const Button: Component<Props> = ({
  children,
  class: className,
  ...restProps
}: Props) => (
  <button {...restProps} class={clsx(classes.button, className)}>
    {children}
  </button>
);

export default Button;
