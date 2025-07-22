
"use client";

import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  "data-testid"?: string;
  required?: boolean;
}

/**
 * Reusable TextArea component with a label and optional required indicator.
 */
export const TextArea = ({
  label,
  className,
  "data-testid": dataTestId,
  required = false,
  ...rest
}: TextAreaProps) => {
  return (
    <div className="flex flex-col gap-[5px] w-full">
      {label && (
        <span>
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <textarea
        data-testid={dataTestId}
        className={`inputDiv rounded-md ${className}`}
        {...rest}
      />
    </div>
  );
};

export default TextArea;
