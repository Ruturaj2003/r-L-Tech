import type {
  FieldValues,
  Path,
  UseFormRegister,
  Control,
} from "react-hook-form";

import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ============================================================================
 * 1. CONTROLLED INPUT (text, number, email, password, date, etc.)
 * ========================================================================== */

export interface ControlledInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  className?: string;
}

export function ControlledInput<T extends FieldValues>({
  name,
  register,
  error,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
}: ControlledInputProps<T>) {
  return (
    <Input
      className={className}
      id={name}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      {...register(name)}
    />
  );
}

/* ============================================================================
 * 2. CONTROLLED TEXTAREA
 * ========================================================================== */

export interface ControlledTextareaProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function ControlledTextarea<T extends FieldValues>({
  name,
  register,
  error,
  placeholder,
  rows = 3,
  disabled = false,
}: ControlledTextareaProps<T>) {
  return (
    <Textarea
      id={name}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      {...register(name)}
    />
  );
}

/* ============================================================================
 * 3. CONTROLLED SELECT (shadcn)
 * ========================================================================== */
export interface SelectOption<V extends string = string> {
  label: string;
  value: V;
}

export interface ControlledSelectProps<
  T extends FieldValues,
  V extends string = string,
> {
  name: Path<T>;
  control: Control<T>;
  options: readonly SelectOption<V>[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// -------------------------------------
// Component
// -------------------------------------
export function ControlledSelect<
  T extends FieldValues,
  V extends string = string,
>({
  name,
  control,
  options,
  error,
  placeholder = "Select an option",
  disabled = false,
  className = "",
}: ControlledSelectProps<T, V>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          value={field.value ?? ""}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger className={className} aria-invalid={!!error}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
/* ============================================================================
 * 4. CONTROLLED DATE (HTML date input, RHF-safe)
 * ========================================================================== */

export interface ControlledDateProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  disabled?: boolean;
}

export function ControlledDate<T extends FieldValues>({
  name,
  register,
  error,
  disabled = false,
}: ControlledDateProps<T>) {
  return (
    <Input
      id={name}
      type="date"
      disabled={disabled}
      aria-invalid={!!error}
      {...register(name)}
    />
  );
}

// USAGE:
// type LoginFormValues = {
//   email: string;
//   password: string;
//   role: "admin" | "user";
//   notes: string;
//   joinDate: string;
// };

// <ControlledInput<LoginFormValues>
//   name="email"
//   type="email"
//   register={register}
//   error={errors.email?.message}
// />

// <ControlledTextarea<LoginFormValues>
//   name="notes"
//   register={register}
//   error={errors.notes?.message}
// />

// <ControlledSelect<LoginFormValues, "admin" | "user">
//   name="role"
//   options={[
//     { label: "Admin", value: "admin" },
//     { label: "User", value: "user" },
//   ]}
//   setValue={setValue}
//   error={errors.role?.message}
// />

// <ControlledDate<LoginFormValues>
//   name="joinDate"
//   register={register}
//   error={errors.joinDate?.message}
// />
