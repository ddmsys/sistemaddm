"use client";

import { forwardRef, useState, useEffect } from "react";
import { Input } from "./input";
import { masks } from "@/lib/utils/masks";
import { InputProps } from "./input"; // ✅ IMPORTAR TIPO

interface MaskedInputProps extends Omit<InputProps, "onChange"> {
  mask: "phone" | "cpf" | "cnpj" | "cep" | "document";
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value = "", onChange, error, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);

    // ✅ SINCRONIZAR COM PROP VALUE
    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      let maskedValue = rawValue;

      // ✅ APLICAR MÁSCARA
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
        case "document":
          // ✅ AUTO-DETECTAR CPF OU CNPJ
          const numbers = masks.onlyNumbers(rawValue);
          maskedValue =
            numbers.length <= 11 ? masks.cpf(rawValue) : masks.cnpj(rawValue);
          break;
      }

      setDisplayValue(maskedValue);
      onChange?.(maskedValue);
    };

    // ✅ PLACEHOLDERS INTELIGENTES
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

    // ✅ CRIAR PROPS CORRETAS PARA INPUT
    const inputProps = {
      ...props,
      value: displayValue,
      onChange: handleChange,
      placeholder: getPlaceholder(),
      error: error,
    };

    return <Input {...inputProps} ref={ref} />;
  }
);

MaskedInput.displayName = "MaskedInput";
