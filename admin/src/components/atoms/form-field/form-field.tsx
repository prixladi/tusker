import clsx from 'clsx';
import { Accessor, Component, JSX, Show } from 'solid-js';

import classes from './form-field.module.scss';

type Field = {
  name: string;
  value?: any;
  onInput: (e: InputEvent) => void;
  error?: string;
};

type Props = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'onInput' | 'value' | 'name'
> & {
  label?: string;
  groupClass?: string;
  field: Accessor<Field>;
};

const FormField: Component<Props> = ({
  label,
  field,
  class: className,
  groupClass,
  ...inputProps
}) => (
  <div class={clsx(classes.group, groupClass)}>
    {label && (
      <label class={classes.label} for={field().name}>
        {label}
      </label>
    )}
    <input
      id={field().name}
      value={field().value}
      name={field().name}
      onInput={field().onInput}
      {...inputProps}
      class={clsx(classes.input, className, field().error && classes.withError)}
    />
    <Show when={field().error}>
      <span class={classes.error}>{field().error}</span>
    </Show>
  </div>
);

export default FormField;
