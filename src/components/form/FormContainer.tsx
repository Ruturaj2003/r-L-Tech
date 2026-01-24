import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FORM_MODE } from "@/types/commonTypes";
import { Loader2 } from "lucide-react";

/**
 * Props for the FormContainer component.
 */
interface FormContainerProps {
  /** Title displayed in the card header */
  title: string;

  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;

  /** Indicates whether the form is currently submitting */
  isSubmitting: boolean;

  /** Form fields or content */
  children: React.ReactNode;

  /** Optional card width or layout classes */
  className?: string;

  /** Callback to close the form when rendered inside a modal */
  onClose?: () => void;

  /** Current form mode */
  mode: FORM_MODE;

  /** Delete handler used when mode is "Delete" */
  onDelete?: () => void;
}

/**
 * UI configuration for submit button based on form mode.
 * View mode is intentionally excluded.
 */
const MODE_UI_CONFIG: Record<
  Exclude<FORM_MODE, "View">,
  {
    label: string;
    variant: "default" | "destructive";
  }
> = {
  Create: { label: "Save", variant: "default" },
  Edit: { label: "Update", variant: "default" },
  Delete: { label: "Delete", variant: "destructive" },
};

/**
 * Layout wrapper for forms used in both pages and modals.
 * Handles submit, delete, loading state, and consistent UI structure.
 */
export const FormContainer = ({
  title,
  onSubmit,
  isSubmitting,
  children,
  className = "max-w-xl",
  onClose,
  mode,
  onDelete,
}: FormContainerProps) => {
  const submitConfig = mode !== "View" ? MODE_UI_CONFIG[mode] : null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <form onSubmit={onSubmit} aria-busy={isSubmitting}>
        <CardContent className="space-y-6">{children}</CardContent>

        <CardFooter className="flex justify-end">
          <div className="flex gap-x-2">
            {onClose && (
              <Button type="button" variant="secondary" onClick={onClose}>
                Close
              </Button>
            )}

            {submitConfig && (
              <Button
                type={mode === "Delete" ? "button" : "submit"}
                variant={submitConfig.variant}
                disabled={isSubmitting}
                onClick={mode === "Delete" ? onDelete : undefined}
                aria-live="polite"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {submitConfig.label}...
                  </>
                ) : (
                  submitConfig.label
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
