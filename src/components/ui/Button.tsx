"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { DynamicIcons } from "./DynamicIcons";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  isLoading?: boolean;
  iconName?: string;
  variant?: ButtonVariant;
  "data-testid"?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-theme-blue text-white",
  secondary: "bg-white text-theme-blue",
  danger: "bg-red-500 text-white",
};

export const Button = ({
  children,
  isLoading = false,
  iconName,
  className,
  variant = "primary",
  "data-testid": dataTestId,
  ...rest
}: ButtonProps) => {
  const onlyIcon = !!iconName && !children;

  return (
    <button
      data-testid={dataTestId}
      className={`
                flex items-center gap-[5px] text-sm px-4 py-2 w-fit rounded-md cursor-pointer
                ${variantClasses[variant]}
                ${isLoading ? "opacity-70 bg-gray-400 text-black cursor-not-allowed" : ""}
                ${onlyIcon ? "justify-center" : ""}
                ${className}
            `}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          {iconName && (
            <span className={onlyIcon ? "mx-auto" : ""}>
              <DynamicIcons iconName={iconName} />
            </span>
          )}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
};
