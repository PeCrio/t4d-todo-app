
"use client";

import { InputHTMLAttributes } from "react";

interface CheckboxToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; 
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Reusable CheckboxToggle component with a label.
 */
export const CheckboxToggle = ({
  label,
  id,
  checked,
  onChange,
  className,
  ...rest
}: CheckboxToggleProps) => {
  return (
    <div className="flex items-center gap-[5px]">
      <input
        type="checkbox"
        className={`rounded-md ${className}`}
        checked={checked}
        onChange={onChange}
        id={id}
        {...rest}
      />
      <label className="text-[15px] cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

