interface TextInputProps {
  props: {
    title: string;
    fieldName: string;
    error: string | undefined;
  };
}

export const TextInput = ({ props: { title, error, fieldName } }: TextInputProps) => {
  return (
    <div className="flex flex-col mb-4 w-100">
      <label className="ml-4 text-sm text-neutral-400" htmlFor={fieldName}>
        {title}
      </label>
      <input className="bg-faded px-4 py-2 rounded-xs mt-1" type="text" id={fieldName} placeholder={title} />
      <p className="text-red px-4 mt-1">{error}</p>
    </div>
  );
};
