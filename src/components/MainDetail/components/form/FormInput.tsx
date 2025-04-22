import React, { ChangeEvent } from "react";

interface FormInputProps {
  label: string | JSX.Element;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  className,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-labelNormal text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`shared-input-gray border-none rounded w-full py-2 px-3 text-labelNeutral leading-tight focus:outline-none ${className} ${
          type === "date" ? "date-input" : ""
        }`}
        style={{ color: value === "" ? "#919191" : undefined, border: "1px solid #3B3D3F" }}
      />
      <style jsx>{`
        input.shared-input-gray:hover,
        input.shared-input-gray:focus {
          border-color: #c3e88d !important;
        }
        input.shared-input-gray:focus {
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default FormInput;
