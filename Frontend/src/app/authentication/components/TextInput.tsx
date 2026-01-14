interface TextInputProps {
  props: {
    title: string;
    fieldName: string;
    error: string | undefined;
    value: string;
    changeValue: (newValue: string) => void;
  };
}

export const TextInput = ({ props: { title, error, fieldName, value, changeValue } }: TextInputProps) => {
  return (
    <div className="flex flex-col mb-8 w-100">
      <label className="ml-4 text-sm text-neutral-400" htmlFor={fieldName}>
        {title}
      </label>

      <input
        value={value}
        className="bg-faded px-4 py-2 rounded-xs mt-1"
        type="text"
        id={fieldName}
        placeholder={title}
        onChange={(e) => changeValue(e.target.value)}
      />

      <p className="text-red px-4 mt-1 h-1">{error}</p>
    </div>
  );
};
