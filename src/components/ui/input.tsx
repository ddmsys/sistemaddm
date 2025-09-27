// src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const inputVariants = cva(
  "flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
  {
    variants: {
      size: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-12 px-4 py-3",
      },
      variant: {
        default: "border-slate-300",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        success:
          "border-green-500 focus:border-green-500 focus:ring-green-500/20",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

// ✅ INTERFACE CORRIGIDA
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string;
  success?: string;
  label?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size,
      variant,
      error,
      success,
      label,
      hint,
      leftIcon,
      rightIcon,
      loading,
      clearable,
      onClear,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const effectiveVariant = error ? "error" : success ? "success" : variant;
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const passwordIcon = isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-slate-500 hover:text-slate-700 transition-colors focus:outline-none"
        tabIndex={-1}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    ) : null;

    const loadingIcon = loading ? (
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-blue-500" />
    ) : null;

    const clearButton =
      clearable && props.value && !disabled && !loading ? (
        <button
          type="button"
          onClick={onClear}
          className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
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
      <div className="space-y-2">
        {label && (
          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor={props.id}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            type={inputType}
            className={cn(
              inputVariants({ size, variant: effectiveVariant }),
              leftIcon && "pl-10",
              finalRightIcon && "pr-10",
              className
            )}
            ref={ref}
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

        {success && !error && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {hint && !error && !success && (
          <p className="text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
