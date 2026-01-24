import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { FORM_MODE } from "../types/otherMaster.types";
import { Loader2 } from "lucide-react";

interface FormContainerProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  children: React.ReactNode;
  className?: string;
  setModalClose?: () => void;
  mode: FORM_MODE;
  onDeleteClick?: () => void;
}

// -------------------------------------
// Mode → UI Configuration
// -------------------------------------
const MODE_UI_CONFIG: Record<
  Exclude<FORM_MODE, "View">,
  {
    label: string;
    variant: "default" | "destructive";
  }
> = {
  Create: {
    label: "Save",
    variant: "default",
  },
  Edit: {
    label: "Update",
    variant: "default",
  },
  Delete: {
    label: "Delete",
    variant: "destructive",
  },
};

// -------------------------------------
// Component
// -------------------------------------
export const FormContainer = ({
  title,
  onSubmit,
  isSubmitting,
  children,
  className = "max-w-xl",
  setModalClose,
  mode,
  onDeleteClick,
}: FormContainerProps) => {
  const submitConfig = mode !== "View" ? MODE_UI_CONFIG[mode] : null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {/* IMPORTANT: form wrapper for proper submit */}
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">{children}</CardContent>

        <CardFooter className="flex justify-end">
          <div className="flex gap-x-2">
            {setModalClose && (
              <Button type="button" variant="secondary" onClick={setModalClose}>
                Close
              </Button>
            )}

            {submitConfig && (
              <Button
                type={mode === "Delete" ? "button" : "submit"}
                variant={submitConfig.variant}
                disabled={isSubmitting}
                onClick={mode === "Delete" ? onDeleteClick : undefined}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    submitConfig.label...
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
