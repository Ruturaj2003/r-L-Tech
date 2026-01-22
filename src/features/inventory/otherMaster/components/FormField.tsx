import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({
  children,
  label,
  name,
  error,
  required,
  className = "space-y-2",
}: FormFieldProps) => {
  return (
    <div className={className}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
