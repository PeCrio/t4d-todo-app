
"use client";

import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  "data-testid"?: string;
  required?: boolean;
}

/**
 * Reusable Input component with a label and optional required indicator.
 */
export const Input = ({
  label,
  className,
  "data-testid": dataTestId,
  required = false,
  ...rest
}: InputProps) => {
  return (
    <div className="flex flex-col gap-[5px] w-full">
      {label && (
        <span>
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <input
        data-testid={dataTestId}
        className={`inputDiv rounded-md ${className}`}
        {...rest}
      />
    </div>
  );
};

