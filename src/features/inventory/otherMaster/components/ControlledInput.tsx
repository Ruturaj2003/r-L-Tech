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

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";

/* ============================================================================
 * 1. CONTROLLED INPUT (native inputs via register)
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
      id={name}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      className={className}
      {...register(name)}
    />
  );
}

/* ============================================================================
 * 2. CONTROLLED TEXTAREA (native textarea via register)
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
 * 3. CONTROLLED SELECT (Radix / shadcn via Controller)
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
          <SelectTrigger
            ref={field.ref}
            className={className}
            aria-invalid={!!error}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent position="item-aligned" className=" max-h-12">
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
 * 4. CONTROLLED DATE (native date input via register)
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

/* ============================================================================
 * 5. CONTROLLED COMBOBOX (shadcn Combobox via Controller)
 * ========================================================================== */

export interface ComboboxOption<V extends string = string> {
  label: string;
  value: V;
}
export interface ControlledComboboxProps<
  T extends FieldValues,
  V extends string = string,
> {
  name: Path<T>;
  control: Control<T>;
  options: readonly ComboboxOption<V>[];
  error?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  showClear?: boolean;
  className?: string;
}

export function ControlledCombobox<
  T extends FieldValues,
  V extends string = string,
>({
  name,
  control,
  options,
  error,
  placeholder = "Select an option",
  emptyMessage = "No items found.",
  disabled = false,
  showClear = false,
  className = "",
}: ControlledComboboxProps<T, V>) {
  const itemValues = options.map((opt) => opt.value);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <Combobox
            items={itemValues}
            value={field.value ?? ""}
            onValueChange={(val) => {
              field.onChange(val ?? "");
            }}
            disabled={disabled}
          >
            <ComboboxInput
              ref={field.ref}
              value={selectedOption?.label ?? ""}
              placeholder={placeholder}
              showClear={showClear}
              aria-invalid={!!error}
              className={className}
              disabled={disabled}
            />

            <ComboboxContent>
              <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

              <ComboboxList>
                {(item: V) => {
                  const option = options.find((opt) => opt.value === item);
                  return (
                    <ComboboxItem key={item} value={item}>
                      {option?.label ?? item}
                    </ComboboxItem>
                  );
                }}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    />
  );
}

// Example useForm setup
// const { register, control, formState: { errors } } = useForm<ExampleFormValues>();

// -------------------------------------
// 1. ControlledInput
// -------------------------------------

// <ControlledInput<ExampleFormValues>
//   name="email"
//   type="email"
//   register={register}
//   error={errors.email?.message}
//   placeholder="Enter email"
// />

// <ControlledInput<ExampleFormValues>
//   name="password"
//   type="password"
//   register={register}
//   error={errors.password?.message}
// />

// -------------------------------------
// 2. ControlledTextarea
// -------------------------------------

// <ControlledTextarea<ExampleFormValues>
//   name="notes"
//   register={register}
//   error={errors.notes?.message}
//   placeholder="Enter notes"
// />

// -------------------------------------
// 3. ControlledSelect
// -------------------------------------

// <ControlledSelect<ExampleFormValues, "admin" | "user">
//   name="role"
//   control={control}
//   options={[
//     { label: "Admin", value: "admin" },
//     { label: "User", value: "user" },
//   ]}
//   error={errors.role?.message}
//   placeholder="Select role"
// />

// -------------------------------------
// 4. ControlledDate
// -------------------------------------

// <ControlledDate<ExampleFormValues>
//   name="joinDate"
//   register={register}
//   error={errors.joinDate?.message}
// />

// Example useForm setup
// const { control, formState: { errors } } = useForm<ExampleFormValues>();

// -------------------------------------
// 5. ControlledCombobox
// -------------------------------------

// <ControlledCombobox<ExampleFormValues, "nextjs" | "sveltekit" | "nuxtjs">
//   name="framework"
//   control={control}
//   options={[
//     { label: "Next.js", value: "nextjs" },
//     { label: "SvelteKit", value: "sveltekit" },
//     { label: "Nuxt.js", value: "nuxtjs" },
//   ]}
//   error={errors.framework?.message}
//   placeholder="Select a framework"
//   showClear
// />
