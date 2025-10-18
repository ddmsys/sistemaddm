"use client";

import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { createContext, Fragment, ReactNode, useContext, useState } from "react";

import { cn } from "@/lib/utils";

// ===== INTERFACES =====

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}

export interface SelectTriggerProps {
  children?: ReactNode;
  className?: string;
  placeholder?: string;
}

export interface SelectValueProps {
  placeholder?: string;
}

export interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export interface SelectItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

// ===== CONTEXTO =====

interface SelectContextValue {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  options: SelectOption[];
  setOptions: (options: SelectOption[]) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select");
  }
  return context;
}

// ===== COMPONENTE PRINCIPAL =====

export function Select({ value, onValueChange, disabled = false, children }: SelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled, options, setOptions }}>
      <Listbox value={value} onChange={onValueChange} disabled={disabled}>
        <div className="relative">{children}</div>
      </Listbox>
    </SelectContext.Provider>
  );
}

// ===== SUB-COMPONENTES =====

export function SelectTrigger({ children, className, placeholder }: SelectTriggerProps) {
  const { disabled, value, options } = useSelectContext();
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Listbox.Button
      className={cn(
        "relative w-full cursor-default rounded-md border border-primary-200 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span className="block truncate">
        {children || selectedOption?.label || placeholder || "Selecione..."}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </span>
    </Listbox.Button>
  );
}

export function SelectValue({ placeholder = "Selecione..." }: SelectValueProps) {
  const { value, options } = useSelectContext();
  const selectedOption = options.find((opt) => opt.value === value);

  return <>{selectedOption?.label || placeholder}</>;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const [query, setQuery] = useState("");

  // Extrair options dos children SelectItem
  const childrenArray = Array.isArray(children) ? children : [children];
  const options: SelectOption[] = childrenArray
    .filter((child) => child?.type === SelectItem)
    .map((child) => ({
      value: child.props.value,
      label: typeof child.props.children === "string" ? child.props.children : child.props.value,
      disabled: child.props.disabled,
    }));

  const { setOptions } = useSelectContext();

  // Atualizar options no contexto
  useState(() => {
    setOptions(options);
  });

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        className={cn(
          "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
          className,
        )}
      >
        {/* Busca opcional */}
        <div className="sticky top-0 bg-white px-3 py-2">
          <input
            type="text"
            className="w-full rounded-md border border-primary-200 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {filteredOptions.length === 0 ? (
          <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
            Nenhuma opção encontrada.
          </div>
        ) : (
          filteredOptions.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={({ active }) =>
                cn(
                  "relative cursor-default select-none py-2 pl-10 pr-4",
                  active ? "bg-blue-100 text-blue-900" : "text-gray-900",
                  option.disabled && "cursor-not-allowed opacity-50",
                )
              }
            >
              {({ selected }) => (
                <>
                  <span className={cn("block truncate", selected ? "font-medium" : "font-normal")}>
                    {option.label}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))
        )}
      </Listbox.Options>
    </Transition>
  );
}

export function SelectItem({ value, children, disabled, className }: SelectItemProps) {
  // Este componente não renderiza nada diretamente
  // Suas props são lidas pelo SelectContent
  return null;
}

// ===== COMPONENTE LEGADO (COMPATIBILIDADE) =====

export interface SelectPropsLegacy {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
}

/**
 * @deprecated Use o novo padrão: Select + SelectTrigger + SelectValue + SelectContent + SelectItem
 */
export function SelectLegacy({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  label,
  error,
  disabled = false,
  searchable = true,
}: SelectPropsLegacy) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-primary-700">{label}</label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger placeholder={placeholder}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
