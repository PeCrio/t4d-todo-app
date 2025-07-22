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
    secondary: "bg-gray-200 text-gray-800",
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
    return (
        <button
            data-testid={dataTestId}
            className={`
                flex items-center gap-[5px] text-[14px] py-2 w-fit px-4 rounded-sm self-end cursor-pointer
                ${variantClasses[variant]}
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
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
                        <span>
                            <DynamicIcons iconName={iconName} />
                        </span>
                    )}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
};
