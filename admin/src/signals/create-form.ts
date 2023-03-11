import joi from 'joi';
import { createMutable } from 'solid-js/store';
import { createMemo, createSignal } from 'solid-js';

export type SubmitUtils<T extends {}> = {
  setError: <Key extends keyof T>(field: Key, error: string) => void;
};

type Props<T extends {}> = {
  defaultData: T;
  onSubmit: (data: T, utils: SubmitUtils<T>) => Promise<void> | void;
  schema?: joi.Schema<T>;
};

export type RegisterResult = {
  name: string;
  value?: any;
  onInput: (e: InputEvent) => void;
  error?: string;
};

const createForm = <T extends {}>({
  onSubmit,
  defaultData,
  schema,
}: Props<T>) => {
  const [submitting, setSubmitting] = createSignal(false);
  const data = createMutable(defaultData);
  const errors = createMutable<Partial<Record<keyof T, string>>>({});

  const setError = <Key extends keyof T>(field: Key, error: string) => {
    errors[field] = error;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (submitting()) return;

    setSubmitting(true);
    try {
      let dataToSubmit = data;

      if (schema) {
        const result = schema.validate(data, { abortEarly: false });

        if (result.error) {
          for (const { path, message } of result.error.details) {
            setError(path.join('.') as keyof T, message);
          }
          return;
        }

        dataToSubmit = result.value;
      }

      await onSubmit(dataToSubmit, { setError });
    } finally {
      setSubmitting(false);
    }
  };

  const register = <Key extends keyof T>(field: Key) =>
    createMemo<RegisterResult>(() => {
      return {
        name: field as string,
        value: data[field],
        onInput: (e: InputEvent) => {
          errors[field] = undefined;
          data[field] = (e.currentTarget as any).value;
        },
        error: errors[field],
      };
    });

  return { handleSubmit, register, submitting };
};

export default createForm;
