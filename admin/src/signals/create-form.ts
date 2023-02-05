import { createResource, JSX } from 'solid-js';
import { createMutable, createStore } from 'solid-js/store';

type Props<T extends {}> = {
  defaultData: T;
  onSubmit: (data: T) => Promise<void> | void;
};

const createForm = <T extends {}>({ onSubmit, defaultData }: Props<T>) => {
  const data = createMutable(defaultData);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await onSubmit(data);
  };

  const register = <Key extends keyof T>(field: Key) => {
    return {
      value: data[field],
      onInput: (e: InputEvent) => (data[field] = (e.currentTarget as any).value),
      name: field
    };
  };

  return { handleSubmit, register };
};

export default createForm;
