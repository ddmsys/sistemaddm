"use client";

import { masks } from "@/lib/utils/masks";
import type React from "react";
import { forwardRef, InputHTMLAttributes, useEffect, useState } from "react";
import { Input } from "./input";

// Props públicas: expomos onChange(string) para facilitar quem usa o componente
interface MaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  mask: "phone" | "cpf" | "cnpj" | "cep" | "document";
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value = "", onChange, error, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);

    // ✅ sincroniza quando o value externo muda
    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    // Internamente lidamos com o evento nativo, aplicamos a máscara
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value ?? "";
      let maskedValue = rawValue;

      switch (mask) {
        case "phone":
          maskedValue = masks.phone(rawValue);
          break;
        case "cpf":
          maskedValue = masks.cpf(rawValue);
          break;
        case "cnpj":
          maskedValue = masks.cnpj(rawValue);
          break;
        case "cep":
          maskedValue = masks.cep(rawValue);
          break;
        case "document": {
          const numbers = masks.onlyNumbers(rawValue);
          maskedValue =
            numbers.length <= 11 ? masks.cpf(rawValue) : masks.cnpj(rawValue);
          break;
        }
      }

      setDisplayValue(maskedValue);
      onChange?.(maskedValue); // ✅ propaga string (sem any)
    };

    const getPlaceholder = (): string => {
      if (props.placeholder) return props.placeholder;
      switch (mask) {
        case "phone":
          return "(11) 99999-9999";
        case "cpf":
          return "123.456.789-00";
        case "cnpj":
          return "12.345.678/0001-00";
        case "cep":
          return "12345-678";
        case "document":
          return "CPF ou CNPJ";
        default:
          return "";
      }
    };

    return (
      <Input
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        aria-invalid={!!error || undefined}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";
