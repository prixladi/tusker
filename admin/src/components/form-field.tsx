import { Form, FormControlProps } from 'solid-bootstrap';
import { JSX } from 'solid-js';

type Props = JSX.InputHTMLAttributes<HTMLInputElement> &
  FormControlProps & {
    label?: string;
  };

const FormField = ({ label, ...fcProps }: Props) => {
  return (
    <Form.Group class='mb-3'>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control {...fcProps} />
    </Form.Group>
  );
};

export default FormField;
