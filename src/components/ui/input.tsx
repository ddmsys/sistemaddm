// src/components/ui/input.tsx
import { FormFieldProps } from "@/lib/types/shared";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { forwardRef, InputHTMLAttributes } from "react";

// ================ INTERFACE ÚNICA ================
interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    FormFieldProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

// ================ COMPONENTE ÚNICO ================
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      required,
      helpText,
      leftIcon,
      rightIcon,
      loading,
      clearable,
      onClear,
      className = "",
      type,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    // Classes base do input
    const baseClasses = `
      block w-full rounded-md border-gray-300 shadow-sm 
      focus:border-blue-500 focus:ring-blue-500 sm:text-sm
      disabled:bg-gray-50 disabled:text-gray-500
      transition-colors duration-200
      ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
      ${leftIcon ? "pl-10" : ""}
      ${rightIcon || loading || clearable || type === "password" ? "pr-10" : ""}
    `.trim();

    // Lógica do password toggle
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const passwordIcon = isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        tabIndex={-1}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    ) : null;

    const loadingIcon = loading ? (
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500" />
    ) : null;

    const clearButton =
      clearable && props.value && !disabled && !loading ? (
        <button
          type="button"
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label="Limpar campo"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ) : null;

    const finalRightIcon =
      loadingIcon || passwordIcon || clearButton || rightIcon;

    return (
      <div className="space-y-1">
        {label && (
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor={props.id}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={cn(baseClasses, className)}
            disabled={disabled || loading}
            {...props}
          />

          {finalRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {finalRightIcon}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
