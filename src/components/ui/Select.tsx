
"use client";

import { SelectHTMLAttributes } from "react";
import Image from "next/image";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string | number }[];
  placeholder?: string;
  "data-testid"?: string;
}

/**
 * Reusable Select component with a label and custom arrow icon.
 */
export const Select = ({
  label,
  options,
  placeholder,
  className,
  "data-testid": dataTestId,
  ...rest
}: SelectProps) => {
  return (
    <div className="relative">
      {label && <p className="mb-1">{label}</p>}
      <select
        data-testid={dataTestId}
        className={`border border-theme-blue rounded-md p-2 outline-none w-full ${className}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option disabled>No options available</option>
        )}
      </select>
      <Image
        src="/images/arrow-down.png"
        alt="Arrow down"
        height={20}
        width={20}
        className="pointer-events-none absolute right-3 top-[45px] transform -translate-y-1/2 w-4 h-4"
      />
    </div>
  );
};

