import Image from "next/image";

interface PasswordInputProps {
  props: {
    title: string;
    fieldName: string;
    error: string | undefined;
    value: string;
    changeValue: (newValue: string) => void;
    hidePassword: boolean;
    setHidePassword: (state: boolean) => void;
  };
}

export const PasswordInput = ({
  props: { title, error, fieldName, value, changeValue, hidePassword, setHidePassword },
}: PasswordInputProps) => {
  return (
    <div className="flex flex-col mb-8 w-100">
      <label className="ml-4 text-sm text-neutral-400" htmlFor={fieldName}>
        {title}
      </label>

      <div className="flex justify-between bg-faded px-4 py-2 rounded-xs mt-1">
        <input
          value={value}
          className="w-full pr-4"
          type={hidePassword ? "password" : "text"}
          id={fieldName}
          placeholder={title}
          onChange={(e) => changeValue(e.target.value)}
        />
        <button type="button" onClick={() => setHidePassword(!hidePassword)}>
          {hidePassword ? (
            <Image alt="eye close password" src="/icons/eyeHide.png" width={24} height={24} />
          ) : (
            <Image alt="eye close password" src="/icons/eyeShow.png" width={24} height={24} />
          )}
        </button>
      </div>

      <p className="text-red px-4 mt-1 h-1">{error}</p>
    </div>
  );
};
