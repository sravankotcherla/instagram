import { FormEvent, useState } from "react";

interface AuthFormProps {
  formFields: { id: string; label: string; value: string }[];
  onSubmit: (formData: { [key: string]: string }) => void;
  submitBtnText: string;
}
export const AuthForm = (props: AuthFormProps) => {
  const { formFields, onSubmit, submitBtnText } = props;
  const initialFormData = formFields.reduce(
    (accum, curr) => ({ ...accum, [curr.value]: "" }),
    {}
  );
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    initialFormData
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };
  return (
    <form className="w-full flex flex-col gap-2 " onSubmit={handleSubmit}>
      {formFields.map((formField) => (
        <input
          type="text"
          id={formField.id}
          key={formField.id}
          className="authInput"
          value={formData[formField.value]}
          placeholder={formField.label}
          onChange={(event) => {
            setFormData({
              ...formData,
              [formField.value]: event.currentTarget.value,
            });
          }}
        ></input>
      ))}
      <button className="signBtn mt-3">{submitBtnText}</button>
    </form>
  );
};
