import React, { ChangeEvent } from "react";

interface FormDropdownProps {
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number | string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}

const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
  placeholder,
  className,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-labelNormal text-sm font-bold mb-2">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        value={value}
        onChange={onChange}
        multiple={multiple}
        className={`shared-select-gray border-none rounded w-full py-2 px-3 text-labelNeutral leading-tight focus:outline-none focus:ring-2 focus:ring-c3e88d focus:border-c3e88d hover:border-c3e88d ${className}`}
        style={{
          color: value === "" ? "#919191" : undefined,
          border: "1px solid #3B3D3F",
        }}
      >
        <option value="" style={{ color: "#919191" }}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <style jsx>{`
        select.shared-select-gray:hover {
          border-color: #c3e88d !important;
        }
        select.shared-select-gray:focus {
          border-color: #c3e88d !important;
          box-shadow: 0 0 0 1px rgba(195, 232, 141, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default FormDropdown;
